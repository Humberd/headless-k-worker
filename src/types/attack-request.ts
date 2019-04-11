import { BaseRequest } from './_base-request';

export interface AttackRequest extends BaseRequest {
  sideId: string;
  battleId: string;
}
