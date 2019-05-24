import { Nationality } from '../battle-algorithm/battle-analyzer-enums';

export interface BattleStatsResponse {
  stats: Stats;
  zone_finished: boolean;
  division: Division;
  logs: Logs;
  fightersData: {[key: string]: FightersDatum};
  opponentsInQueue: number;
  isInQueue: boolean;
  campaigns: any[];
  epicBattle: number;
  activeEffects: any[];
  battleEffects: any[];
  maxHit: string;
  battle_zone_situation: {[key: string]: number};
  most_contested: {[key: string]: number};
  wohRewards: string;
}

export interface Division {
  bar: {[key: string]: Bar};
  created_at: string;
  defence_shield: {[key: string]: Bar};
  domination: {[key: string]: Bar};
  [key: string]: The37_Class | any;
}

export interface The37_Class {
  '1': The1;
  '2': The1;
  '3': The1;
  '4': The1;
  '11': The11;
  total: number;
}

export interface The1 {
  points: number;
  domination: string;
  won: number;
}

export interface The11 {
  points: number;
  domination: number;
  won: number;
}

export type Bar = number | {[key: string]: The35_Value} | null | string;

export interface The35_Value {
  top_damage: Top[];
  top_kills: Top[];
}

export interface Top {
  battle_id: null | string;
  zone_id: string;
  division: null | string;
  citizen_id: null | string;
  damage: null | string;
  kills: null | string;
  side_country_id: null | string;
  type?: Type;
  hits?: null;
}

export enum Type {
  TopDamage = 'top_damage',
  TopKills = 'top_kills',
}

export interface FightersDatum {
  id: string;
  name: string;
  residence_country_id: string;
  avatar_version: null | string;
  avatar_file: null | string;
  avatar: string;
}

export interface Logs {
  attackers: any[];
  defenders: any[];
}

export interface Stats {
  overall: Overall[];
  current: Current;
  personal: Personal[];
}

export interface Current {
  [key: string]: {
    '1': CurrentNationalities
    '2': CurrentNationalities
    '3': CurrentNationalities
    '4': CurrentNationalities
    '11': CurrentNationalities
  };
}

export type CurrentNationalities = {
  [key in keyof typeof Nationality]: The35_Value
}

export interface Overall {
  '35': The35_Value;
}

export interface Personal {
  '': Empty;
}

export interface Empty {
  top_damage: Top[];
}
