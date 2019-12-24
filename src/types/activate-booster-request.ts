import { BaseRequest } from './_base-request';

export interface ActivateBoosterRequest extends BaseRequest {
  type: string;
  quality: number;
  duration: number;
  battleId: string;
  battleZoneId: number;
  sideId: string;
}

export class PerstigePointsBooster3MinRequest implements ActivateBoosterRequest {
  type = 'prestige_points';
  duration = 180;
  quality = 1;

  constructor(
      public battleId: string,
      public battleZoneId: number,
      public sideId: string,
  ) {
  }
}