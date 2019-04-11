import { BaseRequest } from './_base-request';

export interface ActivateBoosterRequest extends BaseRequest {
  type: string; // damage
  quality: string;
  duration: number;
  battleId: string;
}
