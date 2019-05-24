import { AppStatus } from '../../state.service';

export interface StatusUpdateRequest {
  version: string;
  status: AppStatus;
  message?: string;
}
