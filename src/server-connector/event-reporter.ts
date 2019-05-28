import { getLogger } from 'log4js';
import { AppStatus, StateService } from '../state.service';
import { ServerNetworkProxy } from './server-network-proxy';
import { JobStatusRequest } from './_models/job-status-request';

const logger = getLogger('Event Reporter');

export class EventReporter {
  constructor(private stateService: StateService,
              private serverNetworkProxy: ServerNetworkProxy) {

  }

  async reportWorkerStatus() {
    return await this.safeResponse(this.serverNetworkProxy.reportWorkerStatus({
      status: this.stateService.status,
      version: this.stateService.version,
      message: this.stateService.statusMessage
    }));
  }

  async reportJobStatus(status: JobStatusRequest) {
    return await this.safeResponse(this.serverNetworkProxy.reportJobStatus(status))
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
      this.stateService.statusMessage = `${jobName}: ${this.stringifyError(error)}`;
      // this.dispatcher.shutdown(); // todo revert this change
    } catch (e) {
      logger.fatal('!!!!!!!!!!!!!!!!!!!!!!!!! ERROR WHILE REPORTING FATAL ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      logger.fatal(e);
    }
  }

  stringifyError(error: any): string {
    if (typeof error === 'object') {
      return (error.message || JSON.stringify(error));
    }
    return `${error}`;
  }

}
