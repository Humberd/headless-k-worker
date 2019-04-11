export interface InventoryResponse {
  inventoryItems: InventoryItems;
  inventoryStatus: InventoryStatus;
}

export interface InventoryItems {
  activeEnhancements: ActiveEnhancements;
  finalProducts: FinalProducts;
  rawMaterials: RawMaterials;
}

export interface ActiveEnhancements {
  title: string;
  id: string;
  items: ActiveEnhancementsItems;
}

export interface ActiveEnhancementsItems {
  '4_1_active': The4_1_Active;
}

export interface The4_1_Active {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: any[];
  active: Active;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The4_1_ActiveAttributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  activationCost: number;
  activationMessage: string;
  maxQuality: number;
}

export interface Active {
  uses: number;
  time_left: number;
}

export interface The4_1_ActiveAttributes {
  durability: Durability;
  energyPool: Durability;
  overtimePoints: Durability;
  recoveryRate: Durability;
  info?: Durability;
}

export interface Durability {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface FinalProducts {
  title: string;
  id: string;
  items: FinalProductsItems;
}

export interface FinalProductsItems {
  '1_1': The1_1;
  '1_2': The1_1;
  '1_3': The1_1;
  '1_10': The1_1;
  '2_7': The2_7;
  '3_5': The3_5;
  '4_1': The4_1;
  '4_100': The4_100;
  '2_29': The2_29;
  '2_21': The2_21;
  '100_damageBoosters_5_86400': The100__;
  '100_damageBoosters_5_28800': The100__;
  '100_damageBoosters_5_7200': The100__;
  '100_damageBoosters_10_28800': The100__;
  '100_damageBoosters_10_7200': The100__;
  '100_speedBoosters_1_300': The100__SpeedBoosters1_;
  '100_speedBoosters_1_180': The100__SpeedBoosters1_;
  '100_prestigePointsBoosters_1_301': The100_PrestigePointsBoosters1_301;
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
  activationData: The100_CatchupBoosters30_60_ActivationData;
  active: number;
  icon: number;
  tooltip: string;
  token: string;
  attributes: The100_CatchupBoosters30_60_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
  duration: number;
  canActivateBooster: number;
}

export interface The100_CatchupBoosters30_60_ActivationData {
  tooltip: string;
  url: string;
  params: PurpleParams;
}

export interface PurpleParams {
  type: string;
  quality: number;
  duration: number;
  fromInventory: boolean;
}

export interface The100_CatchupBoosters30_60_Attributes {
  damageBoost: DamageBoost;
  duration: Durability;
}

export interface DamageBoost {
  id: string;
  name: string;
  type: string;
  value: string;
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
  activationData: The100_CatchupBoosters30_60_ActivationData;
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
  prestigeBoost: Durability;
  duration: Durability;
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
  activationData: The100_CatchupBoosters30_60_ActivationData;
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
  damageAcceleration: DamageBoost;
  duration: Durability;
}

export interface The1_1 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The1_1_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  maxQuality?: number;
}

export interface The1_1_Attributes {
  energyRestore: Durability;
}

export interface The2_21 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: The2_21_ActivationData;
  active: number;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The2_21_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
}

export interface The2_21_ActivationData {
  tooltip: string;
  url: string;
  params: FluffyParams;
}

export interface FluffyParams {
  bombId: number;
}

export interface The2_21_Attributes {
  firePower: Durability;
  durability: Durability;
  expiration: DamageBoost;
}

export interface The2_29 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: The2_21_ActivationData;
  active: number;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The2_29_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  type: string;
}

export interface The2_29_Attributes {
  firePower: Durability;
  durability: Durability;
}

export interface The2_7 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The2_29_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  used: Used;
  maxQuality: number;
}

export interface Used {
  durability: Durability;
}

export interface The3_5 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The3_5_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  maxQuality: number;
}

export interface The3_5_Attributes {
  movingDistance: Durability;
  energyLoss: Durability;
}

export interface The4_1 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: The4_1_ActivationData;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The4_1_ActiveAttributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  activationCost: number;
  activationMessage: string;
  maxQuality: number;
}

export interface The4_1_ActivationData {
  url: string;
  params: TentacledParams;
}

export interface TentacledParams {
  quality: number;
  type: string;
  action: string;
}

export interface The4_100 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: The4_100_Attributes;
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
}

export interface The4_100_Attributes {
  info: Durability;
}

export interface RawMaterials {
  title: string;
  id: string;
  items: RawMaterialsItems;
}

export interface RawMaterialsItems {
  '7_1': The12_1;
  '7_1_partial': The1__Partial;
  '12_1': The12_1;
  '12_1_partial': The1__Partial;
  '17_1': The12_1;
  '17_1_partial': The1__Partial;
}

export interface The12_1 {
  name: string;
  id: string;
  industryId: number;
  quality: number;
  amount: number;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: any[];
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
  underCostruction: number;
}

export interface The1__Partial {
  name: string;
  id: string;
  industryId: number;
  quality: string;
  amount: string;
  activable: number;
  deactivable: number;
  activableFromInventory: number;
  activableFromBattlefield: number;
  activationData: number;
  active: number;
  activationTooltip: string;
  icon: string;
  tooltip: string;
  token: string;
  attributes: any[];
  isRaw: number;
  isPartial: number;
  isBooster: number;
  isBomb: number;
  isPackBooster: number;
}

export interface InventoryStatus {
  totalStorage: number;
  usedStorage: number;
  color: string;
}
