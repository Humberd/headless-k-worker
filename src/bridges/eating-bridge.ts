import { NetworkProxy, UnknownError } from '../network-proxy';
import { StateService } from '../state.service';
import { phase } from '../utils';
import { getLogger } from 'log4js';
import { EatMobileResponse } from '../types/eat-mobile-response';

const logger = getLogger('EatingBridge');

export class EatingBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Eating')
  async eat() {
    const response = await this.networkProxy.eat();

    const oldHpPrim = this.stateService.healthBarPrimary;
    const oldHpSec = this.stateService.healthBarSecondary;
    const newHpPrim = response.health;
    const newHpSec = response.food_remaining;
    this.stateService.healthBarPrimary = newHpPrim;
    this.stateService.healthBarSecondary = newHpSec;

    logger.info(`Eating result: (${oldHpPrim}+${oldHpSec}) -> (${newHpPrim}+${newHpSec})`);
  }

  @phase('Eating mobile')
  async eatMobile() {
    let response = await this.requestEatMobile();

    const oldHpPrim = this.stateService.healthBarPrimary;
    const oldHpSec = this.stateService.healthBarSecondary;
    const newHpPrim = response.energy;
    const newHpSec = response.recoverableEnergy;
    this.stateService.healthBarPrimary = newHpPrim;
    this.stateService.healthBarSecondary = newHpSec;

    logger.info(`Eating result: (${oldHpPrim}+${oldHpSec}) -> (${newHpPrim}+${newHpSec})`);
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

  /**
   * When eating, the response says there is an error when in fact was no energy refilled.
   * We don't care about this specific error.
   */
  private async requestEatMobile() {
    try {
      return await this.networkProxy.eatMobile();
    } catch (e) {
      if (!(e instanceof UnknownError)) {
        throw e;
      }
      const body = e.body as EatMobileResponse;

      if (body?.error?.message === 'No energy refilled') {
        return body;
      } else {
        throw e;
      }
    }
  }
}
