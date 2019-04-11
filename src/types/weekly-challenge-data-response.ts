export interface WeeklyChallengeDataResponse {
  error: boolean;
  enabled: boolean;
  type: Type;
  timeLeft: number; // in seconds
  nextReward: NextReward;
  maxRewardId: number;
  player: Player;
  progress: number;
  rewards: Rewards;
}

export interface NextReward {
  maxReward: boolean;
  type: string;
  text: string;
}

export interface Player {
  avatar: string;
  name: string;
  prestigePoints: number;
}

export interface Rewards {
  normal: Normal[];
  extra: any[];
}

export interface Normal {
  id: number;
  collectedBefore: number;
  percent: number;
  label: string;
  tooltip: string;
  status: Status;
  icon: string;
}

export enum Status {
  Completed = 'completed',
  Empty = '',
  Rewarded = 'rewarded',
}

export interface Type {
  anniversary: boolean;
  flavorPacks: boolean;
  springChallenge: boolean;
  halloweenChallenge: boolean;
}
