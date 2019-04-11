import { BaseRequest } from './_base-request';

export interface DailyRewardRequest extends BaseRequest{
  action: 'check'
}
