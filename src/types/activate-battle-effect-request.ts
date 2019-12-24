import { BaseRequest } from './_base-request';

export interface ActivateBattleEffectRequest extends BaseRequest{
  citizenId: string;
  battleId: string;
  type: 'snowFight'
}