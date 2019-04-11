import { NetworkProxy } from '../network-proxy';
import { handleErrorMessage, phase } from '../utils';
import { getLogger } from 'log4js';
import { StateService } from '../state.service';

const logger = getLogger('TrainBridge');

export class TrainBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Daily train')
  async trainDaily() {
    try {
      const response = await this.networkProxy.train();
      this.stateService.lastTrainDay = this.stateService.currentDay;

      return response;
    } catch (e) {
      handleErrorMessage(e, 'already_trained', () => {
        logger.info('Already trained');
        this.stateService.lastTrainDay = this.stateService.currentDay;
      });
    }
  }

}
