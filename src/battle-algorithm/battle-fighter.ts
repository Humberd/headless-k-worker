import { AttackConfig, BattleBridge } from '../bridges/battle-bridge';
import { BattleAnalysis, BattleAnalyzer } from './battle-analyzer';
import { BattleChooser } from './battle-chooser';
import { AttackConfigChooser } from './attack-config-chooser';
import { WeeklyChallengeBridge } from '../bridges/weekly-challenge-bridge';
import { RewardCollectorBridge } from '../bridges/reward-collector.bridge';
import { TravelBridge } from '../bridges/travel-bridge';
import { noExceptionExecutor, sleep } from '../utils';
import { IntensityType } from './battle-analyzer-enums';
import { StateService } from '../state.service';
import { getLogger } from 'log4js';

const logger = getLogger('BattleFighter');

export class BattleFighter {
  constructor(private battleBridge: BattleBridge,
              private battleAnalyzer: BattleAnalyzer,
              private battleChooser: BattleChooser,
              private attackConfigChooser: AttackConfigChooser,
              private weeklyChallengeBridge: WeeklyChallengeBridge,
              private rewardCollectorBridge: RewardCollectorBridge,
              private travelBridge: TravelBridge,
              private stateService: StateService) {

  }

  async tryFight() {
    const battles = await this.battleBridge.getBattles();
    const analyzedBattles = this.battleAnalyzer.analyzeBattles(battles);
    const bestBattle = this.battleChooser.chooseBestBattle(analyzedBattles);
    const attackConfig = this.attackConfigChooser.calculateAttackConfig(bestBattle);

    logger.debug(attackConfig);

    if (!this.shouldFight(attackConfig, bestBattle)) {
      logger.info('~~ Not fighting ~~');
      return;
    }

    if (!this.stateService.userConfig.enableFighting) {
      logger.info('Fighting has not been enabled.');
      return;
    }

    return this.fight(attackConfig);
  }

  private shouldFight(attackConfig: AttackConfig, battle: BattleAnalysis): boolean {
    const {
      healthBarPrimary,
      healthBarSecondary,
      userConfig: {
        minimalNormalFightSecondaryHpPercent,
        minimalEpicFightPrimaryHp
      }
    } = this.stateService;


    if (battle.intensityType === IntensityType.EPIC) {
      if (healthBarPrimary < minimalEpicFightPrimaryHp) {
        logger.info(`Not enough HP for epic. Current: ${healthBarPrimary}. Required: ${minimalEpicFightPrimaryHp}`);
        return false;
      }

      return true;
    }

    /* We only want to fight when the secondary health bar is full */
    if (healthBarSecondary === 0) {
      logger.info('Not enough secondary HP. Current: 0');
      return false;
    }

    /* healthBarPrimary is now our full max health  */
    const minHp = healthBarPrimary * minimalNormalFightSecondaryHpPercent;
    if (minHp > healthBarSecondary) {
      logger.info(`Not enough secondary HP. Current: ${healthBarSecondary}. Required: ${minHp}`);
      return false;
    }

    return true;
  }

  private async fight(config: AttackConfig) {
    await this.battleBridge.chooseBattleSide(config.battleId, config.sideId);

    if (config.requiresTravel) {
      await this.travelBridge.travel(config.battleId, config.sideId);
    }

    await this.battleBridge.changeWeapon(config.battleId, config.battleType);

    try {
      return await this.battleBridge.startAttacking(config);
    } finally {
      await this.onAfterFight(config.requiresTravel);
    }
  }

  private async onAfterFight(requiresTravelHome: boolean) {
    const tasks: (() => Promise<any>)[] = [
      this.weeklyChallengeBridge.collectAllRewards.bind(this.weeklyChallengeBridge),
      this.rewardCollectorBridge.collectDailyTaskReward.bind(this.rewardCollectorBridge),
      this.battleBridge.collectDailyOrderReward.bind(this.battleBridge)
    ];

    if (requiresTravelHome) {
      tasks.push(sleep.bind(null, 1500));
      tasks.push(this.travelBridge.travelHome.bind(this.travelBridge));
    }

    /* We want all tasks to be executed even when one of them fails */
    const errors = await noExceptionExecutor(tasks);

    if (errors.length === 0) {
      return;
    }

    for (let error of errors) {
      logger.error(error);
    }

    throw errors[0];
  }

}

