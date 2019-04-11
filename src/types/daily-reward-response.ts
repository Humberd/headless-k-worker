export interface DailyRewardResponse {
  msg: Msg;
  error: boolean;
  multiplier: number;
}

export interface Msg {
  completed: boolean;
  hasReward: boolean;
  successfullyRewarded?: boolean;
}
