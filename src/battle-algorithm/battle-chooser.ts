import { BattleAnalysis } from './battle-analyzer';
import { IntensityType } from './battle-analyzer-enums';
import { StateService } from '../state.service';
import { findMax } from '../utils';
import { getLogger } from 'log4js';

const logger = getLogger('BattleChooser');

/**
 * Implements an algorithm that chooses the best available battle
 */
export class BattleChooser {
  constructor(private stateService: StateService) {

  }

  chooseBestBattle(battles: BattleAnalysis[]): BattleAnalysis {
    const scores = battles.map(it => this.scoreBattle(it));
    const max = findMax(scores);

    const theBestBattle = battles[max.index];

    if (Object.entries(theBestBattle).length === 0 || !theBestBattle) {
      logger.debug('battles', JSON.stringify(battles));
      logger.debug('scores:', scores);
      logger.debug('max:', max);
    }
    logger.debug(`The best battle with score ${max.value} is: ${JSON.stringify(theBestBattle)}`);

    return theBestBattle;
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
}
