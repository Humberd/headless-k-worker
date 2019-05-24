export interface ChangeWeaponResponse {
  weaponId: number;
  hasWeapon: boolean;
  countWeapons: number;
  skill: string;
  damage: number;
  skillIcon: string;
  weaponImage: string;
  weaponDamage: number;
  weaponDamagePercent: number;
  weaponDurability: number;
  weaponDurabilityPercent: number;
  hasBazookaAmmo: number;
  weaponInfluence: number;
  activeEffects: any[];
  weaponQuantity: number;
}
