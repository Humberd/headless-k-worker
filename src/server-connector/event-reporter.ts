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

  async reportStatus(message?: string) {
    return await this.safeResponse(this.serverNetworkProxy.reportStatus({
      status: this.stateService.status,
      version: this.stateService.version,
      message: message
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
  async reportFatalError(jobId: string, jobName: string, error: any) {
    try {
      logger.fatal(error);
      logger.fatal('---------------------- UNRECOVERABLE ERROR -------------------');
      logger.fatal('---------------------- POSSIBLE API CHANGE -------------------');
      logger.fatal('------------------------- SHUTTING DOWN! ---------------------');

      this.stateService.status = AppStatus.FATAL_ERROR;
      this.reportStatus(`${jobName}: ${this.parseError(error).substr(0, 100)}`);
      this.dispatcher.shutdown();
    } catch (e) {
      logger.fatal('!!!!!!!!!!!!!!!!!!!!!!!!! ERROR WHILE REPORTING FATAL ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      logger.fatal(e);
    }
  }

  private parseError(error: any): string {
    if (typeof error === 'object') {
      return error.message || JSON.stringify(error);
    }
    return `${error}`;
  }

  reportNormalError(jobId: string, jobName: string, error: any) {

  }
}
