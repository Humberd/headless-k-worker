export interface CampainsResponse {
  request_time: number;
  battles: {[key: string]: Battle};
  countries: {[key: string]: Country};
  last_updated: number;
  citizen_contribution: CitizenContribution[];
}

export interface Battle {
  id: number;
  war_id: number;
  zone_id: number;
  is_rw: boolean;
  is_as: boolean;
  type: Type;
  start: number;
  det: number;
  region: City;
  city: City;
  is_dict: boolean;
  is_lib: boolean;
  war_type: WarType;
  inv: Def;
  def: Def;
  div: {[key: string]: Div};
}

export interface City {
  id: number;
  name: string;
}

export interface Def {
  id: number;
  allies: number[];
  ally_list: AllyList[];
  points: number;
}

export interface AllyList {
  id: number;
  deployed: boolean;
}

export interface Div {
  id: number;
  div: number;
  end: number | null;
  division_end: boolean;
  epic: number;
  epic_type: number;
  intensity_scale: IntensityScale;
  co: Co;
  dom_pts: DOMPts;
  wall: Wall;
}

export interface Co {
  inv: any[];
  def: any[];
}

export interface DOMPts {
  inv: number;
  def: number;
}

export enum IntensityScale {
  ColdWar = 'cold_war',
}

export interface Wall {
  for: number;
  dom: number;
}

export enum Type {
  Aircraft = 'aircraft',
  Tanks = 'tanks',
}

export enum WarType {
  Direct = 'direct',
  Resistance = 'resistance',
}

export interface CitizenContribution {
  battle_id: number;
  zone_id: number;
  division: number;
  side_country_id: number;
  damage: number;
  kills: number;
}

export interface Country {
  id: number;
  name: string;
  allies: number[];
  is_empire: boolean;
  cotd: number;
}
