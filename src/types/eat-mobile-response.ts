export interface EatMobileResponse {
  consumedItems: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
    7: number,
    8: number,
    9: number,
    10: number,
    11: number,
    12: number,
  },
  hasCompletedMission: boolean;
  error?: {
    message: string
  },
  energy: number;
  energyLimit: number;
  recoverableEnergy: number;
  recoverableEnergyLimit: number;
  recoveryRate: number;
  recoveryRateInterval: number;
  nextRecoveryRateIntervalIn: number;
  hasFood: boolean;
  foodQuality: number;
  foodRecoveryValue: number;
  lowestFoodQuality: number;
  lowestFoodRecoveryValue: number;
  canRecoverWithFood: boolean;
  hasEnergyBar: boolean;
  energyBarQuality: number;
  energyBarRecoveryValue: number;
  canRecoverWithEnergyBars: boolean;
}
