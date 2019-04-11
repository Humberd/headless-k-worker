export interface ActivateBoosterResponse {
  status: string;
  message: string;
  boosters: Boosters;
}

export interface Boosters {
  inactive: Inactive;
  active: BoostersActive;
}

export interface BoostersActive {
  damageBoosters: ActiveDamageBoosters;
}

export interface ActiveDamageBoosters {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: string;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: ActivationData;
  active: DamageBoostersActive;
  icon: number;
  tooltip: string;
  token: string;
  attributes: DamageBoostersAttributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
  duration: number;
  canActivateBooster: number;
  remaining: number;
}

export interface ActivationData {
  tooltip: string;
  url: URL;
  params: Params;
}

export interface Params {
  type: string;
  quality: number;
  duration: number;
  fromInventory?: boolean;
}

export enum URL {
  EnMilitaryFightActivateBooster = '/en/military/fight-activateBooster',
}

export interface DamageBoostersActive {
  time_left: number;
}

export interface DamageBoostersAttributes {
  damageBoost: Damage;
  duration: Duration;
}

export interface Damage {
  id: string;
  name: string;
  type: string;
  value: string;
}

export interface Duration {
  id: ID;
  name: Name;
  type: string;
  value: number;
}

export enum ID {
  Duration = 'duration',
  PrestigeBoost = 'prestigeBoost',
}

export enum Name {
  Duration = 'Duration',
  The1PrestigePoints = '+1 Prestige Points',
}

export interface Inactive {
  damageBoosters: InactiveDamageBoosters;
  speedBoosters: SpeedBoosters;
  prestigePointsBoosters: PrestigePointsBoosters;
  catchupBoosters: CatchupBoosters;
}

export interface CatchupBoosters {
  '100_catchupBoosters_30_60': The100__;
}

export interface The100__ {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: ActivationData;
  active: number;
  icon: number;
  tooltip: string;
  token: string;
  attributes: DamageBoostersAttributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
  duration: number;
  canActivateBooster: number;
}

export interface InactiveDamageBoosters {
  '100_damageBoosters_5_86400': The100__;
  '100_damageBoosters_5_28800': The100__;
  '100_damageBoosters_5_7200': The100__;
  '100_damageBoosters_10_28800': The100__;
  '100_damageBoosters_10_7200': The100__;
}

export interface PrestigePointsBoosters {
  '100_prestigePointsBoosters_1_301': The100_PrestigePointsBoosters1_301;
}

export interface The100_PrestigePointsBoosters1_301 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: ActivationData;
  active: number;
  icon: number;
  tooltip: string;
  token: string;
  attributes: The100_PrestigePointsBoosters1_301_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
  duration: number;
  canActivateBooster: number;
}

export interface The100_PrestigePointsBoosters1_301_Attributes {
  prestigeBoost: Duration;
  duration: Duration;
}

export interface SpeedBoosters {
  '100_speedBoosters_1_300': The100__SpeedBoosters1_;
  '100_speedBoosters_1_180': The100__SpeedBoosters1_;
}

export interface The100__SpeedBoosters1_ {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: ActivationData;
  active: number;
  icon: number;
  tooltip: string;
  token: string;
  attributes: The100_SpeedBoosters1_180_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
  duration: number;
  canActivateBooster: number;
}

export interface The100_SpeedBoosters1_180_Attributes {
  damageAcceleration: Damage;
  duration: Duration;
}
