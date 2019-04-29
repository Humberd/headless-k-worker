import { BaseRequest } from './_base-request';

export interface SwitchDivisionRequest extends BaseRequest {
  battleId: string;
  countryId: string;
  zoneId: number;
  division: number;
  action: 'activate'
}
