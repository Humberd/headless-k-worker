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
  '34': The34;
  '35': The34;
  bar: {[key: string]: number | {[key: string]: The35_Value} | null | string};
  created_at: string;
  defence_shield: {[key: string]: number | {[key: string]: The35_Value} | null | string};
  domination: {[key: string]: number | {[key: string]: The35_Value} | null | string};
}

export interface The34 {
  '1': The1;
  '2': The1;
  '3': The1;
  '4': The1;
  '11': The1;
  total: number;
}

export interface The1 {
  points: number;
  domination: string;
  won: number;
}

export interface The35_Value {
  top_damage: Top[];
  top_kills: Top[];
}

export interface Top {
  battle_id: string;
  zone_id: string;
  division: string;
  citizen_id: string;
  damage: string;
  kills: string;
  side_country_id: string;
  type?: Type;
  hits?: string;
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
  personal: {[key: string]: Personal};
}

export interface Current {
  '7': {[key: string]: number | {[key: string]: The35_Value} | null | string};
}

export interface Overall {
  '35': The35_Value;
}

export interface Personal {
  '35': Personal35;
}

export interface Personal35 {
  top_damage: Top[];
}
