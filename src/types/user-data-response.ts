export interface UserDataResponse {
  csrf: string;
  id: number;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  levelProgressPercentage: number;
  division: number;
  residenceCountryId: number;
  residenceRegionId: number;
  residenceRegionName: string;
  citizenshipCountryId: number;
  currentCityId: number;
  currentCityName: string;
  currency: number;
  gold: number;
  currentEnergy: number;
  energyPool: number;
  energyToRecover: EnergyToRecover;
  citizenFeeds: CitizenFeeds;
  deployedBattleId: number;
  connectedAccounts: string[];
  iapShopItems: any[];
  activeBoosters: ActiveBooster[];
  weeklyChallenge: WeeklyChallenge;
}

export interface ActiveBooster {
  type: string;
  timeLeft: number;
  boosterState?: string;
}

export interface CitizenFeeds {
  availableFeeds: string[];
  defaultFeed: string;
  enableFeedFilters: boolean;
}

export interface EnergyToRecover {
  value: number;
  reset: number;
}

export interface WeeklyChallenge {
  timeLeft: number;
  nextReward: string;
  canCollect: boolean;
  progressToNext: number;
}
