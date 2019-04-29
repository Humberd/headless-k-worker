import { DispatchJob } from './dispatcher';
import { BattleBridge } from './bridges/battle-bridge';
import { Battle, Type } from './types/campains-response';

export class TokenHunterJob implements DispatchJob {
  actions: Array<() => Promise<any>> = [
    () => this.startSequence()
  ];
  id: string = 'token-hunter';
  name: string = 'Token Hunter';
  shouldStopRunning: () => boolean = () => false;
  timeInterval: number = 1_000_000;

  constructor(private battleBridge: BattleBridge) {

  }

  private async startSequence() {
    const battles = await this.battleBridge.getBattles();
    const tankBattles = battles.filter(it => it.type === Type.Tanks);
    const countriesMap = tankBattles.reduce((previousValue, currentValue) => {
      const defId = String(currentValue.def.id);
      const invId = String(currentValue.inv.id);

      if (!previousValue.has(defId)) {
        previousValue.set(defId, []);
      }

      if (!previousValue.has(invId)) {
        previousValue.set(invId, []);
      }

      previousValue.get(defId).push({
        battle: null,
        battleId: String(currentValue.id),
        sideId: defId
      });

      previousValue.get(invId).push({
        battle: null,
        battleId: String(currentValue.id),
        sideId: invId
      });

      return previousValue;
    }, new Map<String, TokenHunterBattle[]>());

    console.log(countriesMap)

  }

}

interface TokenHunterBattle {
  battleId: string;
  sideId: string;
  battle: Battle
}
