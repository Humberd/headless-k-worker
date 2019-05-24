import { getLogger, Logger } from 'log4js';

export type DispatchJobErrorHandler = (job: DispatchJob, error: any) => Promise<boolean>;

export interface DispatchJob {
  id: string;
  name: string;
  timeInterval: number; // in millis
  shouldStopRunning?: () => boolean; // true when stop run
  handleError?: DispatchJobErrorHandler;
  actions: Array<() => Promise<any>>;
  disableLog?: boolean;
}

export interface InternalDispatchJob extends DispatchJob {
  lastExecution: number; //timestamp
}

export class Dispatcher {
  private timeoutId: NodeJS.Timeout;
  private readonly config: InternalDispatchJob[];
  private isStopped = true;
  private errorHandler: DispatchJobErrorHandler = async () => false;
  private readonly logger: Logger;

  constructor(dispatcherName: string, config: DispatchJob[]) {
    this.config = config.map(it => ({
      lastExecution: 0,
      shouldStopRunning: () => false,
      handleError: async () => false,
      ...it,
    }));

    this.logger = getLogger(`${dispatcherName} Dispatcher`)
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
        await this.handleJob(job);
        !job.disableLog && this.logger.info(`${job.name} - COMPLETED`);

      }
    }
  }

  private async handleJob(job: InternalDispatchJob) {
    try {
      for (const action of job.actions) {
        await action();
      }
    } catch (e) {
      const jobErrorHandlerResult = await job.handleError(job, e);
      if (jobErrorHandlerResult) {
        return
      }

      const generalErrorHandlerResult = await this.errorHandler(job, e);
      if (generalErrorHandlerResult) {
        return;
      }

      this.logger.error('Unhandled Error \n', e);
    }
  }

  onError(errorHandler: DispatchJobErrorHandler): Dispatcher {
    this.errorHandler = errorHandler;

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
