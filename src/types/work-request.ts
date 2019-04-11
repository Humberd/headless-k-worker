import { BaseRequest } from './_base-request';

export interface WorkRequest extends BaseRequest {
  action_type: 'work';
}

export interface OvertimeWorkRequest extends BaseRequest {
  action_type: 'workOvertime'
}

export interface ProductionWorkRequest extends BaseRequest {
  action_type: 'production',

  [key: string]: number | string;
}

export interface ProductionFactory {
  id: string;
  employee_works: 0;
  own_work: 1
}
