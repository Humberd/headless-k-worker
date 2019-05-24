import { BattleAnalysis } from './battle-analyzer';
import { BattleType, IntensityType } from './battle-analyzer-enums';
import { StateService } from '../state.service';
import { getLogger } from 'log4js';
import { BattleStatsResponse } from '../types/battle-stats-response';
import { BattleEqualRankDecision } from './battle-equal-rank-decision';
import { BattleBridge } from '../bridges/battle-bridge';

const logger = getLogger('BattleChooser');

export interface DetailedBattleAnalysis extends BattleAnalysis {
  score: number;
  detailedStats: BattleStatsResponse;
}

/**
 * Implements an algorithm that chooses the best available battle
 */
export class BattleChooser {
  constructor(private stateService: StateService,
              private battleBridge: BattleBridge) {

  }

  async chooseBestBattle(battles: BattleAnalysis[]): Promise<DetailedBattleAnalysis> {
    const detailedBattleAnalysis: DetailedBattleAnalysis[] = battles.map(it => ({
      ...it,
      score: this.scoreBattle(it),
      detailedStats: null
    }));

    const maxScore = Math.max(...detailedBattleAnalysis.map(it => it.score));
    const theBestBattles = detailedBattleAnalysis.filter(it => it.score === maxScore);

    logger.info(`Found ${theBestBattles.length} battles with the highest score of ${maxScore}`);

    return this.decideEqualRank(theBestBattles, this.stateService.userConfig.battleTypePriority);
  }

  private scoreBattle(battle: BattleAnalysis): number {
    let score = 0;

    if (battle.intensityType === IntensityType.EPIC && this.stateService.userConfig.enableEpicsFinder) {
      score += 1 << 4;
    }

    if (battle.intensityType === IntensityType.FULL_SCALE && this.stateService.userConfig.enableEpicsFinder) {
      score += 1 << 3;
    }

    if (battle.battleType === this.stateService.userConfig.battleTypePriority) {
      score += 1 << 2;
    }

    if (battle.nationalities.includes(this.stateService.userConfig.nationalityPriority)) {
      score += 1 << 1;
    }

    /* Doesn't require travel for either side */
    if (battle.requiresTravel.includes(false)) {
      score += 1 << 0;
    }

    return score;
  }

  private async decideEqualRank(battles: DetailedBattleAnalysis[], battleType: BattleType): Promise<DetailedBattleAnalysis> {
    const decision = this.stateService.userConfig.equalRankDecision;

    if (battles.length === 1) {
      return battles[0];
    }

    switch (decision) {
      case BattleEqualRankDecision.THE_FIRST_ONE: {
        return battles[0];
      }
      default: {
        throw new NotImplementedError(`${decision} has not been implemented`);
      }

    }
  }

  private async populateBattlesWithDetails(battles: DetailedBattleAnalysis[]): Promise<DetailedBattleAnalysis[]> {
    return Promise.all(battles.map(async (it) => ({
      ...it,
      detailedStats: await this.battleBridge.getBattleStats(it.id)
    })));
  }
}

export class NotImplementedError extends Error {

}
