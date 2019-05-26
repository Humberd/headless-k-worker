import { JobStatus } from '../server-connector/_models/job-status-request';

export type DispatchJobErrorHandler = (job: DispatchJob, error: any) => Promise<boolean>;
export type DispatchJobSuccessHandler = (job: DispatchJob, jobResponse: JobResponse) => Promise<boolean>

export interface DispatchJob {
  id: string;
  name: string;
  timeInterval: number; // in millis
  shouldStopRunning?: () => boolean; // true when stop run
  handleError?: DispatchJobErrorHandler;
  handleSuccess?: DispatchJobSuccessHandler;
  action: () => Promise<JobResponse>;
  afterAction?: () => Promise<any>;
  disableLog?: boolean;
}

export interface InternalDispatchJob extends DispatchJob {
  lastExecution: number; //timestamp
}

export class JobResponse {
  constructor(
      public readonly status: JobStatus,
      public readonly message: string
  ) {

  }

  static success(message = 'OK'): JobResponse {
    return new JobResponse(JobStatus.SUCCESS, message)
  }

  static alreadyDone(message: string): JobResponse {
    return new JobResponse(JobStatus.ALREADY_DONE, message)
  }

  static error(message: string): JobResponse {
    return new JobResponse(JobStatus.ERROR, message)
  }
}

