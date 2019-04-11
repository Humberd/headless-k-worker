export interface AttackResponse {
  error: boolean;
  message: string;
  details: Details;
  enemy: Enemy;
  loot: Loot;
  collectionsStatus: any[];
  validForLoot: boolean;
  user: User;
  oldEnemy: OldEnemy;
  hasAward: boolean;
  rank: Rank;
  last_fight: LastFight;
  first_kill: boolean;
  show_tutorial: boolean;
  reward: number;
  hits: number;
}

export interface Details {
  level: string;
  points: string;
  max: number;
  percent: number;
  wellness: number;
  energy_limit: number;
  current_energy_ratio: number;
  remaining_energy_ratio: number;
  currency: number;
  gold: number;
  specialFoodValue: number;
  specialFoodmout: number;
}

export interface Enemy {
  name: string;
  health: number;
  skill: string;
  damage: number;
  avatar: string;
  countryFlag: string;
  weaponImage: string;
  isBoss: boolean;
  foodLimit: number;
  energyRatio: number;
  bossData: any[];
}

export interface LastFight {
  last_fight: number;
}

export interface Loot {
  item: any[];
  collection: any[];
}

export interface OldEnemy {
  isNatural: boolean;
  isBoss: boolean;
  bossData: any[];
}

export interface Rank {
  reachedNextLevel: boolean;
  percentage: number;
  points: number;
  nextThreshold: number;
  name: string;
  stars: number;
  img: string;
  rankPointsEarned: number;
  t_name: string;
}

export interface User {
  givenDamage: number;
  earnedRankPoints: number;
  earnedXp: number;
  PVPKillCount: number;
  health: string;
  countWeapons: number;
  weaponId: number;
  skill: string;
  weaponImage: string;
  weaponDamage: number;
  weaponDamagePercent: number;
  weaponDurability: number;
  weaponDurabilityPercent: number;
  hasBazookaAmmo: number;
  level: number;
  division: string;
  bazookaAmmo: boolean;
  has_food_in_inventory: string;
  food_remaining: string;
  food_remaining_reset: string;
  food_time_reset: number;
  specialFoodAmount: number;
  specialFoodValue: number;
  weaponInfluence: number;
  damageBoost: number;
  ghostBoosterActive: number;
  activeEffects: any[];
  battleEffects: any[];
  regimentEffects: any[];
  maxHit: string;
  weaponQuantity: number;
  epicBattle: number;
}
