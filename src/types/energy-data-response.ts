export interface EnergyDataResponse {
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
