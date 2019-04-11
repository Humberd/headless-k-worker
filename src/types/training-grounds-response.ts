export interface TrainingGroundsResponse {
  message: string;
  upgradeBanner: string;
  bfUpgradeBanner: string;
  contracts: Contract[];
  progress: number;
  can_train: boolean;
  grounds: Ground[];
  page_details: PageDetails;
  canTrain: boolean;
  hasFreeTrain: boolean;
  hasTrainingContract: boolean;
  contractExpiresAt: number;
  status: boolean;
  error: boolean;
}

export interface Contract {
  discount: number;
  active: boolean;
  timeLeft: number;
}

export interface Ground {
  id: number;
  trained: boolean;
  training: number;
  anniversary: boolean;
  name: string;
  icon: string;
  quality: number;
  cost: number;
  effectiveCost: number;
  strength: number;
  default: boolean;
}

export interface PageDetails {
  health_tooltip: string;
  gold_tooltip: string;
  health: number;
  recoverable_health: RecoverableHealth;
  health_warn: string;
  health_warn_limit: string;
  gold: number;
  gold_warn: string;
  recoverable_health_in_food: number;
  energy: Energy;
}

export interface Energy {
  amount: number;
  effect: number;
}

export interface RecoverableHealth {
  value: number;
}
