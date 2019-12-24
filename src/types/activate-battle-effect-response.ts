export interface ActivateBattleEffectResponse {
  error: boolean;
  snowFightMessage: string;
  snowFight: SnowFight;
}

export interface SnowFight {
  citizen_id: number;
  citizen_name: string;
  started_at: number;
  ends_at: number;
  time_left: number;
  is_active: number;
}