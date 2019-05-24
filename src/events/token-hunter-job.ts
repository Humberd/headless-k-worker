import { DispatchJob } from '../dispatcher';
import { AttackConfig, BattleBridge } from '../bridges/battle-bridge';
import { Battle, Type } from '../types/campains-response';
import { StateService } from '../state.service';
import { BattleStatsResponse } from '../types/battle-stats-response';
import { BattleType, Nationality } from '../battle-algorithm/battle-analyzer-enums';
import { getLogger } from 'log4js';
import { BattleAnalyzer } from '../battle-algorithm/battle-analyzer';
import { BattleFighter } from '../battle-algorithm/battle-fighter';
import { sleep } from '../utils';

const logger = getLogger('TokenHunterJob');

/**
 * 2019 Spring event.
 *
 * It scanned all battles and fought where player could be in top 3 kills, so that player received tokens.
 * It also changed divisions.
 */
export class TokenHunterJob implements DispatchJob {
  actions: Array<() => Promise<any>> = [
    () => this.startSequence()
  ];
  id: string = 'token-hunter';
  name: string = 'Token Hunter';
  shouldStopRunning: () => boolean = () => false;
  timeInterval: number = 1_000_000;

  private readonly KILLS = 8;
  private readonly DIVISION = 1;

  constructor(private battleBridge: BattleBridge,
              private stateService: StateService,
              private battleAnalyzer: BattleAnalyzer,
              private battleFighter: BattleFighter) {

  }

  private async startSequence() {
    const battles = await this.battleBridge.getBattles();
    const tankBattles = battles.filter(it => it.type === Type.Tanks);
    const countriesMap = this.battlesToMap(tankBattles);

    for (const [key, value] of countriesMap.entries()) {
      await this.fightForCountry(value);
    }
    // await this.fightForCountry(countriesMap.get(String(Nationality.NIGERIA)))
  }

  private async fightForCountry(battles: TokenHunterBattle[]) {
    try {
      const polandBattlesDetails = await Promise.all(battles.map(async (it) => {
        const response = await this.battleBridge.getBattleStats(it.battleId, this.DIVISION);
        return {
          ...it,
          // battle: null,
          details: response,
          topKills: this.getTopKillsRange(response, Number(it.sideId)),
          finished: this.isBattleFinished(response),
          alreadyFought: this.alreadyFought(response, Number(it.sideId)),
        };
      }));

      const filteredPolandBattles = polandBattlesDetails
          .filter(it => !it.finished)
          .filter(it => !it.alreadyFought)
          .filter(it => it.topKills.minKills < this.KILLS);

      logger.info(`Found ${filteredPolandBattles.length} out of ${polandBattlesDetails.length} available battles`);

      for (let bat of filteredPolandBattles) {
        const attackConfig: AttackConfig = {
          battleType: BattleType.TANK,
          battleId: bat.battleId,
          sideId: bat.sideId,
          killsLimit: this.KILLS,
          requiresTravel: this.battleAnalyzer.requiresTravelFor(bat.battle, bat.sideId),
          skipTravelBack: true,
          divisionSwitch: this.DIVISION,
          battleNumber: this.getBattleNumber(bat.details)
        };
        logger.info(attackConfig);

        try {
          await this.battleFighter.fight(attackConfig);
          await sleep(2000);
        } catch (e) {
          logger.error({...bat, details: null});
          throw e;
        }

      }
    } catch (e) {
      logger.error('Fight error', e);
    }
  }

  private getTopKillsRange(battle: BattleStatsResponse, nationality: Nationality): TopKills {
    const topKills = this.getTopKills(battle, nationality);

    return {
      maxKills: (topKills[0] && Number(topKills[0].kills)) || 0,
      minKills: (topKills[1] && Number(topKills[1].kills)) || 0
    };
  }

  private alreadyFought(battle: BattleStatsResponse, nationality: Nationality): boolean {
    const topKills = this.getTopKills(battle, nationality);

    return topKills
        .map(it => it.citizen_id)
        .filter(it => it === this.stateService.userId)
        .length > 0;
  }

  private getTopKills(battle: BattleStatsResponse, nationality: Nationality) {
    const battleNumber: string = Object.keys(battle.stats.current)[0];
    return battle.stats.current[battleNumber][this.DIVISION][nationality].top_kills;
  }

  private getBattleNumber(battle: BattleStatsResponse): number {
    return Number(Object.keys(battle.stats.current)[0]);
  }

  private isBattleFinished(battle: BattleStatsResponse): boolean {
    return battle.zone_finished;
  }

  private battlesToMap(tankBattles: Battle[]) {
    return tankBattles.reduce((previousValue, currentValue) => {
      const defId = String(currentValue.def.id);
      const invId = String(currentValue.inv.id);

      if (!previousValue.has(defId)) {
        previousValue.set(defId, []);
      }

      if (!previousValue.has(invId)) {
        previousValue.set(invId, []);
      }

      previousValue.get(defId).push({
        battle: currentValue,
        battleId: String(currentValue.id),
        sideId: defId
      });

      previousValue.get(invId).push({
        battle: currentValue,
        battleId: String(currentValue.id),
        sideId: invId
      });

      return previousValue;
    }, new Map<String, TokenHunterBattle[]>());
  }
}

interface TopKills {
  maxKills: number;
  minKills: number;
}

interface TokenHunterBattle {
  battleId: string;
  sideId: string;
  battle: Battle;
  details?: BattleStatsResponse;
  topKills?: TopKills;
  finished?: boolean;
  alreadyFought?: boolean;
}
