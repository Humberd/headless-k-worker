export interface CollectDailyTaskRewardResponse {
  message: string;
  day: number;
  strength: number;
  xp: number;
  ghostBooster: number;
  details: Details;
  error: boolean;
}

export interface Details {
  level: number;
  points: number;
  max: number;
  percent: number;
  wellness: number;
  energyLimit: number;
  currentEnergyRatio: number;
  remainingEnergyRatio: number;
  currency: number;
  gold: number;
  specialFoodValue: number;
  specialFoodmout: number;
}
