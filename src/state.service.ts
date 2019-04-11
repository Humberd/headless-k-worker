import { BattleType, Nationality } from './battle-algorithm/battle-analyzer-enums';
import { log, time } from './utils';

export enum AppStatus {
  OK = 'OK',
  FATAL_ERROR = 'FATAL_ERROR',
}

export class StateService {
  @log() version: string = process.env.BUILD_ID;
  @log() status: AppStatus = AppStatus.OK;
  @log() serverUrl: string = process.env.SERVER_URL;
  @log({secure: false}) serverToken: string = process.env.SERVER_TOKEN;

  @log() erpk: string;
  @log({secure: true}) erpk_rm: string = process.env.ERPK_RM; //remember_me token
  @log() _token: string;

  @log() healthBarLimit: number;
  @log() healthBarPrimary: number;
  @log() healthBarSecondary: number;
  @log() healthRegen: number; // per 6 minutes

  @log() userId: string;
  @log() currentCountryLocationId: Nationality;

  @log() currentDay: number;
  @log() weeklyChallengeTimeLeftMs: number; // in milliseconds
  @log() dayTimeLeftMs: number; // in milliseconds

  @log() lastWorkDay: number;
  @log() lastWorkOvertimeDay: number;
  @log() lastWorkProductionDay: number;
  @log() lastTrainDay: number;
  @log() lastGoldBuyDay: number;

  @log() userConfig = {
    battleTypePriority: BattleType.AIR,
    nationalityPriority: Nationality.POLAND,
    maxKillsIn1Go: 25,
    enableEpicsFinder: false,
    minimalEpicFightPrimaryHp: 200,
    minimalNormalFightSecondaryHpPercent: 0.9,
    enableFighting: true
  };

  calcTimeToFullSecondaryHp(): number {
    const currentTotalHp = this.healthBarPrimary + this.healthBarSecondary;
    const fullTotalHp = this.healthBarLimit * 2;
    const hpToRegen = fullTotalHp - currentTotalHp;
    const remainingTimeInMs = (hpToRegen / this.healthRegen) * time(6, 'minutes');
    return remainingTimeInMs;
  }

  workedToday(): boolean {
    return this.lastWorkDay === this.currentDay;
  }

  workedOvertimeToday(): boolean {
    return this.lastWorkOvertimeDay === this.currentDay;
  }

  workedProductionToday(): boolean {
    return this.lastWorkProductionDay === this.currentDay;
  }

  trainedToday(): boolean {
    return this.lastTrainDay === this.currentDay;
  }

  isWcStartDay(): boolean {
    const wcDay = Math.floor(this.weeklyChallengeTimeLeftMs / time(1, 'days'));

    return wcDay === 6;
  }

  dayTimeElapsed(timeMs: number): boolean {
    const elapsedDayTime = time(1, 'days') - this.dayTimeLeftMs;

    return elapsedDayTime > timeMs;
  }

}
