import { BaseRequest } from './_base-request';

export interface TravelRequest extends BaseRequest {
  battleId: string;
  sideCountryId?: string;
  toCountryId?: string;
  inRegionId?: string;
}
