import { BaseRequest } from './_base-request';

export interface ProfileUpdateRequest extends BaseRequest {
  action: 'options'
  params: ProfileUpdateParams
}

export type ProfileUpdateParams = ProfileUpdateWebDeployChange;

export interface ProfileUpdateWebDeployChange {
  optionName: 'enable_web_deploy';
  optionValue: 'on' | 'off'
}
