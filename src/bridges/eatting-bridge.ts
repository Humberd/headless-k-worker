import { NetworkProxy } from '../network-proxy';
import { StateService } from '../state.service';
import { phase } from '../utils';
import { getLogger } from 'log4js';

const logger = getLogger('EattingBridge');

export class EattingBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Eatting')
  async eat() {
    const response = await this.networkProxy.eat();

    const oldHpPrim = this.stateService.healthBarPrimary;
    const oldHpSec = this.stateService.healthBarSecondary;
    const newHpPrim = response.health;
    const newHpSec = response.food_remaining;
    this.stateService.healthBarPrimary = newHpPrim;
    this.stateService.healthBarSecondary = newHpSec;

    logger.info(`Eatting result: (${oldHpPrim}+${oldHpSec}) -> (${newHpPrim}+${newHpSec})`);
  }

  @phase('Refresh energy data')
  async refreshEnergyData() {
    const response = await this.networkProxy.getEnergyData();

    this.stateService.healthRegen = response.recoveryRate;
    this.stateService.healthBarLimit = response.recoverableEnergyLimit;
    this.stateService.healthBarPrimary = response.energy;
    this.stateService.healthBarSecondary = response.recoverableEnergy;

    return response;
  }

}
