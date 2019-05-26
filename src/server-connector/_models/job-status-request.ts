export interface JobStatusRequest {
  jobId: string;
  jobName: string;
  day: number;
  timeInterval: number;
  status: JobStatus;
  message: string;
}

export enum JobStatus {
  SUCCESS = 'SUCCESS',
  ALREADY_DONE = 'ALREADY_DONE',
  ERROR = 'ERROR'
}
