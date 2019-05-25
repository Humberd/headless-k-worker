import { AppStatus } from '../../state.service';

export interface WorkerStatusRequest {
  version: string;
  status: AppStatus;
  message?: string;
}
