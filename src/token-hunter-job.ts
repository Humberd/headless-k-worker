import { DispatchJob } from './dispatcher';
import { BattleBridge } from './bridges/battle-bridge';
import { Battle, Type } from './types/campains-response';
import { StateService } from './state.service';
import { BattleStatsResponse } from './types/battle-stats-response';
import { Nationality } from './battle-algorithm/battle-analyzer-enums';

export class TokenHunterJob implements DispatchJob {
  actions: Array<() => Promise<any>> = [
    () => this.startSequence()
  ];
  id: string = 'token-hunter';
  name: string = 'Token Hunter';
  shouldStopRunning: () => boolean = () => false;
  timeInterval: number = 1_000_000;

  private readonly KILLS = 5;

  constructor(private battleBridge: BattleBridge,
              private stateService: StateService) {

  }

  private async startSequence() {
    const battles = await this.battleBridge.getBattles();
    const tankBattles = battles.filter(it => it.type === Type.Tanks);
    const countriesMap = this.battlesToMap(tankBattles);

    const polandBattles = countriesMap.get('35');
    const polandBattlesDetails = await Promise.all(polandBattles.map(async (it) => {
      const response = await this.battleBridge.getBattleStats(it.battleId);
      return {
        ...it,
        battle: null,
        // details: response,
        topKills: this.getTopKillsRange(response, Number(it.sideId)),
        finished: this.isBattleFinished(response),
        alreadyFought: this.alreadyFought(response, Number(it.sideId))
      };
    }));

    console.log(polandBattlesDetails);

  }

  private getTopKillsRange(battle: BattleStatsResponse, nationality: Nationality): TopKills {
    const topKills = this.getTopKills(battle, nationality);

    return {
      maxKills: (topKills[0] && Number(topKills[0].kills)) || 0,
      minKills: (topKills[2] && Number(topKills[2].kills)) || 0
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
    console.log(battle.stats.current[battleNumber]['4']);
    return battle.stats.current[battleNumber]['4'][nationality].top_kills;
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
