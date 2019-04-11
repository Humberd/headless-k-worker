import { Dispatcher } from '../dispatcher';
import { getLogger } from 'log4js';
import { AppStatus, StateService } from '../state.service';
import { ServerNetworkProxy } from './server-network-proxy';

const logger = getLogger('Event Reporter');

export class EventReporter {
  constructor(private dispatcher: Dispatcher,
              private stateService: StateService,
              private serverNetworkProxy: ServerNetworkProxy) {

  }

  async reportStatus() {
    return await this.safeResponse(this.serverNetworkProxy.reportStatus({
      status: this.stateService.status,
      version: this.stateService.version
    }));
  }

  /**
   * Should not throw any errors
   */
  private async safeResponse<T>(request: Promise<T>) {
    try {
      return await request;
    } catch (e) {
      logger.error(`Error occured`, e);
      return;
    }
  }

  /**
   *  We can't shut the app down, because k8s would restart the app, which is not a desired solution
   */
  reportFatalError(jobId: string, jobName: string, error: any): void {
    try {
      logger.fatal(error);
      logger.fatal('---------------------- UNRECOVERABLE ERROR -------------------');
      logger.fatal('---------------------- POSSIBLE API CHANGE -------------------');
      logger.fatal('------------------------- SHUTTING DOWN! ---------------------');

      this.stateService.status = AppStatus.FATAL_ERROR;
      this.dispatcher.shutdown();
    } catch (e) {
      logger.fatal('!!!!!!!!!!!!!!!!!!!!!!!!! ERROR WHILE REPORTING FATAL ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      logger.fatal(e);
    }
  }

  reportNormalError(jobId: string, jobName: string, error: any) {

  }
}
