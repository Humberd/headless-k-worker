export interface JobStatusRequest {
  jobId: string;
  jobName: string;
  day: number;
  status: JobStatus;
  message: string;
}

export enum JobStatus {
  SUCCESS,
  ALREADY_DONE
}
