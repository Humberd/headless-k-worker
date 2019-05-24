import { BaseRequest } from './_base-request';

export interface ChangeWeaponRequest extends BaseRequest {
  battleId: string;
  customizationLevel: WeaponType;
}

export enum WeaponType {
  NO_WEAPON = -1,
  Q1 = 1,
  Q2 = 2,
  Q3 = 3,
  Q4 = 4,
  Q5 = 5,
  Q6 = 6,
  Q7 = 7,
  BAZOOKA = 10
}
