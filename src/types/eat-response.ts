export interface EatResponse {
  has_food_in_inventory: number;
  lowest_quality_food: LowestQualityFood;
  health: number; //current health
  food_remaining: number; //second health bar
  food_remaining_reset: string;
  show_reset: boolean;
  hasSpecialFoodItem: number;
  specialFoodAmount: number; //energy bars
  specialFoodValue: number;
  units_consumed: {[key: string]: number};
  current_energy_ratio: number;
  remaining_energy_ratio: number;
}

export interface LowestQualityFood {
  q: string;
  use: number;
}
