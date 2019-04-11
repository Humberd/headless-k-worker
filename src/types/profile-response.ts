export interface ProfileResponse {
  citizen: Citizen;
  citizenAttributes: CitizenAttributes;
  isAdult: boolean;
  aboutMe: string;
  location: Location;
  city: City;
  achievements: Achievement[];
  isAmbassador: boolean;
  isTopPlayer: boolean;
  isPresident: boolean;
  isCongressman: boolean;
  isPartyPresident: boolean;
  isPartyMember: boolean;
  isDictator: boolean;
  isModerator: boolean;
  isBanned: boolean;
  freedomFighter: FreedomFighter;
  friends: Friends;
  military: ProfileResponseMilitary;
  nukes: Nukes;
  title: any[];
  decorations: Decoration[];
  activePacks: any[];
  newspaper: boolean;
  isPlatoFoundationCurrentMember: boolean;
  isPlatoFoundationFormerMember: boolean;
  loggedIn: LoggedIn;
  pvpStats: PvpStats;
  isFallen: boolean;
  isLoggedIn: boolean;
  isBlocked: boolean;
  nationalRank: NationalRank;
  penalties: Penalties;
  events: Events;
  activePacksAmount: number;
}

export interface Achievement {
  name: string;
  img: string;
  descriptionBefore: string;
  descriptionAfter: string;
  moreInfo: string;
  count: number;
  mercenaryProgress?: MercenaryProgress;
}

export interface MercenaryProgress {
  progress: MercenaryProgressProgress;
  details: {[key: string]: Detail};
}

export interface Detail {
  id: number;
  name: string;
  initials: string;
  permalink: string;
  is_active: number;
  continent: number;
  created_at: Date;
  color: number | string;
  capital_region_id: number | null;
  can_create_party: number;
  original_capital_region_id: number;
  empire: number;
  completed?: boolean;
  enemies_killed?: number;
}

export interface MercenaryProgressProgress {
  current: number;
  max: number;
  percent: number;
}

export interface Citizen {
  id: number;
  name: string;
  created_at: Date;
  is_organization: boolean;
  is_alive: boolean;
  has_avatar: boolean;
  avatar_version: null;
  avatar_file: null;
  level: number;
  avatar: string;
  profile_url: string;
  onlineStatus: boolean;
  banStatus: BanStatus;
  hasPendingCitizenshipApplication: boolean;
  pendingCitizenshipApplicationPermalink: string;
  hasTutorial: boolean;
  nextLevelXp: number;
}

export interface BanStatus {
  type: boolean;
  reason: boolean;
}

export interface CitizenAttributes {
  citizen_id: number;
  wellness: number;
  experience_points: number;
  level: number;
}

export interface City {
  residenceCityId: number;
  residenceRoleName: string;
  residenceCity: ResidenceCity;
}

export interface ResidenceCity {
  id: number;
  name: string;
  permalink: string;
  region_id: number;
  city_type_id: number;
  region_name: string;
  region_permalink: string;
  country_id: number;
  country_name: string;
  country_permalink: string;
  avatar: string;
}

export interface Decoration {
  citizen_id: number;
  class: string;
  icon: string;
  text: string;
  amount: number;
  class2: string;
}

export interface Events {
  april1st2017: AnniversaryWeek;
  strengthEnhancement: AnniversaryWeek;
  anniversaryWeek: AnniversaryWeek;
}

export interface AnniversaryWeek {
  isActive: boolean;
}

export interface FreedomFighter {
  achievements: number;
  milestone: Milestone;
  progress: FreedomFighterProgress;
}

export interface Milestone {
  regions: number;
  kills: number;
}

export interface FreedomFighterProgress {
  regions: number;
  wars: Wars;
}

export interface Wars {
  finished: any[];
  inprogress: any[];
}

export interface Friends {
  number: number;
  list: List[];
  isFriend: boolean;
  isFriendRequestPending: boolean;
}

export interface List {
  id: number;
  name: string;
  created_at: Date;
  is_alive: number;
  is_organization: number;
  has_avatar: number;
  avatar_version: null | string;
  avatar_file: null | string;
  avatar: string;
}

export interface Location {
  citizenLocationInfo: CitizenLocationInfo;
  residenceCountry: CitizenshipCountry;
  citizenshipCountry: CitizenshipCountry;
  residenceRegion: ResidenceRegion;
}

export interface CitizenLocationInfo {
  citizen_id: number;
  citizenship_country_id: number;
  residence_country_id: number;
  residence_region_id: number;
}

export interface CitizenshipCountry {
  id: number;
  name: string;
  initials: string;
  permalink: string;
  is_active: number;
  continent: number;
  created_at: Date;
  color: string;
  capital_region_id: number | null;
  can_create_party: number;
  original_capital_region_id: number;
  empire: number;
  completed?: boolean;
  enemies_killed?: number;
}

export interface ResidenceRegion {
  id: number;
  name: string;
  current_owner_country_id: number;
  original_owner_country_id: number;
  permalink: string;
}

export interface LoggedIn {
  hovercardData: HovercardData;
}

export interface HovercardData {
  name: string;
  avatar: string;
  level: number;
  born_on: string;
  is_dead: boolean;
  is_banned: boolean;
  is_online: boolean;
  number_of_friends: number;
  is_friend: boolean;
  is_self: boolean;
  citizenship: Citizenship;
  politicalTitle: string;
  is_org: boolean;
  is_adult: boolean;
  badges: Badge[];
  activity: Activity[];
  fighterInfo: FighterInfo;
  interactionButtons: any[];
}

export interface Activity {
  type: string;
  id: number;
  name: string;
  avatar: string;
  title: string;
  permalink: string;
}

export interface Badge {
  type: string;
  name: string;
  icon: string;
}

export interface Citizenship {
  id: number;
  name: string;
  permalink: string;
}

export interface FighterInfo {
  military: FighterInfoMilitary;
  aviation: Aviation;
}

export interface Aviation {
  rank: number;
  perception: number;
  maxWeaponQ: number;
  damagePerHitNoWeapon: number;
  damagePerHit: number;
  damagePerHitLegend: number;
}

export interface FighterInfoMilitary {
  rank: number;
  strength: number;
  maxWeaponQ: number;
  damagePerHitNoWeapon: number;
  damagePerHit: number;
  damagePerHitLegend: number;
  division: number;
}

export interface ProfileResponseMilitary {
  militaryData: MilitaryData;
  militaryUnit: MilitaryUnit;
  bestDamageData: BestDamageData;
  bestDamageAchievementProgress: number;
  truePatriot: TruePatriot;
}

export interface BestDamageData {
  damage: number;
  battle_id: number;
  side_id: number;
  finished: string;
  for_country: string;
  against_country: string;
  region: string;
  won: boolean;
  attacking: boolean;
  permalink: string;
}

export interface MilitaryData {
  strength: number;
  temporaryStrength: number;
  divisionData: MilitaryDataDivisionData;
  name: string;
  stars: number;
  points: number;
  rankNumber: number;
  icon: string;
  nextRankAt: number;
  progress: number;
  ground: Ground;
  aircraft: Aircraft;
}

export interface Aircraft {
  coordination: number;
  divisionData: AircraftDivisionData;
  name: string;
  stars: number;
  points: number;
  rankNumber: number;
  icon: string;
  nextRankAt: number;
  progress: number;
}

export interface AircraftDivisionData {
  division: number;
  battleHeroReward: number;
}

export interface MilitaryDataDivisionData {
  division: number;
  smallBombDamage: number;
  bazookaBoosterDamage: number;
  battleHeroReward: number;
  formatDivisionInterval?: string;
}

export interface Ground {
  strength: number;
  temporaryStrength: number;
  divisionData: MilitaryDataDivisionData;
  name: string;
  stars: number;
  points: number;
  rankNumber: number;
  icon: string;
  nextRankAt: number;
  progress: number;
}

export interface MilitaryUnit {
  id: number;
  type: string;
  name: string;
  country_id: number;
  leader_id: number;
  second_commander_1: number;
  second_commander_2: number;
  member_count: number;
  has_avatar: number;
  status: number;
  created_at: number;
  regiments_count: number;
  leaders: {[key: string]: {[key: string]: number}};
  current_regiment: CurrentRegiment;
  current_member: CurrentMember;
  militaryRank: string;
  avatar: string;
}

export interface CurrentMember {
  group_name: string;
  group_country_id: number;
  group_id: number;
  regiment_id: number;
  citizen_id: number;
  created_at: number;
  is_full_member: number;
  role_id: null;
}

export interface CurrentRegiment {
  id: number;
  group_id: number;
  number: number;
  name: null;
  captain_id: number;
  member_count: number;
  created_at: number;
}

export interface TruePatriot {
  hasTruePatriotProgress: boolean;
  progress: number;
  currentLevel: number;
  nextLevel: number;
  damage: number;
  citizenship_id: number;
  history: History[];
}

export interface History {
  damage: number;
  citizenship_id: number;
  progress: number;
}

export interface NationalRank {
  xp: number;
}

export interface Nukes {
  bombs: number;
  nukes: number;
  last: Last;
}

export interface Last {
  for: CitizenshipCountry;
  against: Against;
  day: string;
  type: string;
}

export interface Against {
  id: number;
  name: string;
  initials: string;
  permalink: string;
  is_active: number;
  continent: number;
  created_at: Date;
  color: number;
  capital_region_id: number;
  can_create_party: number;
  original_capital_region_id: number;
  empire: number;
  completed?: boolean;
  enemies_killed?: number;
}

export interface Penalties {
  wasPenalized: boolean;
  forfeitPoints: number;
}

export interface PvpStats {
  citizen_id: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
}
