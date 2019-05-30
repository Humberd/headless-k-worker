import { getLogger, Logger } from 'log4js';
import {
  DispatchJob,
  DispatchJobErrorHandler,
  DispatchJobSuccessHandler,
  InternalDispatchJob,
  JobResponse
} from './types';

export class Dispatcher {
  private timeoutId: NodeJS.Timeout;
  private readonly config: InternalDispatchJob[];
  private isStopped = true;
  private errorHandler: DispatchJobErrorHandler = async () => false;
  private successHandler: DispatchJobSuccessHandler = async () => false;
  private readonly logger: Logger;

  constructor(dispatcherName: string, config: DispatchJob[]) {
    this.config = config.map(it => ({
      lastExecution: 0,
      shouldStopRunning: () => false,
      afterAction: async () => false,
      handleSuccess: async () => false,
      handleError: async () => false,
      ...it,
    }));

    this.logger = getLogger(`${dispatcherName} Dispatcher`);
  }

  init(): Dispatcher {
    if (!this.isStopped) {
      this.logger.warn('Already running');
      return this;
    }
    this.isStopped = false;

    const startTimer = () => setTimeout(async () => {
      // logger.debug('*tick*');
      await this.loop();

      if (this.isStopped) {
        this.logger.info('Stopping the next tick');
        return;
      }

      this.timeoutId = startTimer();
    }, 1000);

    this.timeoutId = startTimer();

    return this;
  }

  private async loop() {
    for (const job of this.config) {
      if (this.isStopped) {
        this.logger.info(`Stopping current loop`);
        break;
      }

      const date = new Date();
      const currentTime = date.getTime();
      if (currentTime > job.lastExecution + job.timeInterval) {
        job.lastExecution = currentTime;

        if (job.shouldStopRunning()) {
          this.logger.debug(`${job.name} doesn't meet run requirement`);
          continue;
        }

        !job.disableLog && this.logger.info(`${job.name} - Executing...`);
        await this.handleAction(job);
        !job.disableLog && this.logger.info(`${job.name} - COMPLETED`);

        await this.handleAfterAction(job);

      }
    }
  }

  private async handleAction(job: InternalDispatchJob) {
    let jobResponse: JobResponse;
    try {
      jobResponse = await job.action();
    } catch (e) {
      const jobErrorHandlerResult = await job.handleError(job, e);
      if (jobErrorHandlerResult) {
        return;
      }

      const generalErrorHandlerResult = await this.errorHandler(job, e);
      if (generalErrorHandlerResult) {
        return;
      }

      this.logger.error('Unhandled Error \n', e);
      return;
    }

    const jobSuccessHandlerResult = await job.handleSuccess(job, jobResponse);
    if (jobSuccessHandlerResult) {
      return;
    }

    const generalSuccessHandlerResult = await this.successHandler(job, jobResponse);
    if (generalSuccessHandlerResult) {
      return;
    }

    this.logger.warn('Unhandled Success');
  }

  private async handleAfterAction(job: InternalDispatchJob) {
    try {
      await job.afterAction();
    } catch (e) {
      this.logger.error('After Action Error', e);
    }
  }

  onError(errorHandler: DispatchJobErrorHandler): Dispatcher {
    this.errorHandler = errorHandler;

    return this;
  }

  onSuccess(successHandler: DispatchJobSuccessHandler): Dispatcher {
    this.successHandler = successHandler;

    return this;
  }

  shutdown() {
    if (this.isStopped) {
      this.logger.warn('Already stopped');
      return;
    }
    this.isStopped = true;

    clearTimeout(this.timeoutId);
    this.logger.info('All future jobs have been stopped. Letting the current one finish up');
  }
}
