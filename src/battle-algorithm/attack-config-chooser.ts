import { StateService } from '../state.service';
import { BattleAnalysis } from './battle-analyzer';
import { AttackConfig } from '../bridges/battle-bridge';
import { IntensityType } from './battle-analyzer-enums';
import { getLogger } from 'log4js';
import { PrestigePointsBoosterDecision } from './decisions/prestige-points-booster-decision';
import { SnowFightEffectDecisions } from './decisions/snow-fight-effect-decisions';

const logger = getLogger('AttackConfigChooser');

export class AttackConfigChooser {
  constructor(private stateService: StateService) {

  }

  calculateAttackConfig(battle: BattleAnalysis): AttackConfig {
    return {
      battleId: battle.id,
      sideId: this.getSideId(battle),
      battleType: battle.battleType,
      killsLimit: this.getKillsLimit(battle),
      requiresTravel: this.getRequiresTravel(battle),
      usePrestigePointsBooster: this.shouldUsePrestigePointsBooster(battle),
      useSnowFightEffect: this.shouldUseSnowFightEffect(battle)
    };
  }

  private getSideId(battle: BattleAnalysis): string {
    /* Don't have to travel for some of sides */
    const noTravelIndex = battle.requiresTravel.indexOf(false);
    if (noTravelIndex >= 0) {
      logger.info('Choosing sideId based on noTravel rule');
      return String(battle.nationalities[noTravelIndex]);
    }

    const prioritySideIndex = battle.nationalities.indexOf(this.stateService.userConfig.nationalityPriority);
    if (prioritySideIndex >= 0) {
      logger.info('Choosing sideId based on nationalityPriority rule');
      return String(battle.nationalities[prioritySideIndex]);
    }

    logger.info('Choosing sideId based on ordering');
    return String(battle.nationalities[0]);
  }

  private getKillsLimit(battle: BattleAnalysis) {
    const normalKills = this.stateService.userConfig.maxKillsIn1Go;
    const waitFightKills = 2; // when we are waiting for epic;
    const allInKills = 999999;


    if (battle.intensityType === IntensityType.EPIC) {
      logger.info('!!! EPIC BATTLE DETECTED !!! Going full in');
      return allInKills;
    }

    if (battle.intensityType === IntensityType.FULL_SCALE) {
      logger.info(`Epic battle is likely to be in the near future.`);
      return waitFightKills;
    }

    return normalKills;
  }

  private getRequiresTravel(battle: BattleAnalysis) {
    return !battle.requiresTravel.includes(false);
  }

  private shouldUsePrestigePointsBooster(battle: BattleAnalysis): boolean {
    const activationConfig = this.stateService.userConfig.activatePrestigePointsBooster;
    switch (activationConfig) {
      case PrestigePointsBoosterDecision.EPIC_ONLY:
        return battle.intensityType === IntensityType.EPIC;
      case PrestigePointsBoosterDecision.ALL:
        /* We do like 2 kills when waiting for the EPIC battle, so we don't need to activate a booster yet */
        return battle.intensityType !== IntensityType.FULL_SCALE;
      case PrestigePointsBoosterDecision.OFF:
        return false;
      default:
        throw new Error(`Prestige Points booster activation type is not handled: ${activationConfig}`)
    }

  }

  private shouldUseSnowFightEffect(battle: BattleAnalysis) {
    const activationConfig = this.stateService.userConfig.activateSnowFightEffect;
    switch (activationConfig) {
      case SnowFightEffectDecisions.EPIC_ONLY:
        return battle.intensityType === IntensityType.EPIC;
      case SnowFightEffectDecisions.ALL:
        /* We do like 2 kills when waiting for the EPIC battle, so we don't need to activate a booster yet */
        return battle.intensityType !== IntensityType.FULL_SCALE;
      case SnowFightEffectDecisions.OFF:
        return false;
      default:
        throw new Error(`Snow Fight effect activation type is not handled: ${activationConfig}`)
    }
  }
}
