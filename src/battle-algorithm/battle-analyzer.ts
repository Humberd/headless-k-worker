import { Battle, Type } from '../types/campains-response';
import { BattleType, IntensityType, Nationality } from './battle-analyzer-enums';
import { StateService } from '../state.service';

const ACTIVE_DIVISION = 4;

export interface BattleAnalysis {
  id: string,
  regionName: string,
  intensityType: IntensityType,
  battleType: BattleType,
  nationalities: [Nationality, Nationality],
  requiresTravel: [boolean, boolean],
  battle: Battle
}

/**
 * Maps raw battle to our type [BattleAnalysis]
 */
export class BattleAnalyzer {

  constructor(private stateService: StateService) {

  }

  analyzeBattles(campainsList: Battle[]): BattleAnalysis[] {
    return campainsList.map(it => this.analyzeBattle(it));
  }

  analyzeBattle(battle: Battle): BattleAnalysis {
    return {
      id: String(battle.id),
      regionName: this.findRegionName(battle),
      intensityType: this.findIntensityType(battle),
      battleType: this.findBattleType(battle),
      nationalities: this.findNationalities(battle),
      requiresTravel: this.requiresTravel(battle),
      battle: battle
    };
  }

  requiresTravelFor(battle: Battle, sideId: string): boolean {
    const requiresTravel = this.requiresTravel(battle);
    const sideIdIsDef = battle.def.id === Number(sideId);
    if (sideIdIsDef) {
      return requiresTravel[0]
    }
    return requiresTravel[1]
  }

  /* This was rewritten from erep source code */
  private requiresTravel(battle: Battle): [boolean, boolean] {
    const currentLocationId = this.stateService.currentCountryLocationId;
    let defNeedsToMove = true;
    let invNeedsToMove = true;

    if (currentLocationId === battle.def.id) {
      defNeedsToMove = false;
      if (battle.is_rw) {
        invNeedsToMove = false;
      }
    }

    if (currentLocationId === battle.inv.id && !battle.is_rw) {
      invNeedsToMove = false;
    }

    const defAllies = battle.def.ally_list;
    const invAllies = battle.inv.ally_list;

    if (!battle.is_rw) {
      defAllies.forEach(defAlly => {
        if (defAlly.id === currentLocationId && defAlly.deployed) {
          defNeedsToMove = false;
        }
      });

      invAllies.forEach(invAlly => {
        if (invAlly.id === currentLocationId && invAlly.deployed) {
          invNeedsToMove = false;
        }
      });
    }

    return [defNeedsToMove, invNeedsToMove];
  }

  private findIntensityType(battle: Battle): IntensityType {
    // fixme: division from state
    const currentDivision = ACTIVE_DIVISION;

    const divisionStats = battle.div[currentDivision];
    if (!divisionStats) {
      // air battle
      return IntensityType.NORMAL;
    }
    switch (divisionStats.epic) {
      case 2:
        return IntensityType.EPIC;
      case 1:
        return IntensityType.FULL_SCALE;
      case 0:
        return IntensityType.NORMAL;
    }
  }

  private findBattleType(battle: Battle): BattleType {
    switch (battle.type) {
      case Type.Aircraft:
        return BattleType.AIR;
      case Type.Tanks:
        return BattleType.TANK;
      default:
        throw new BattleAnalysisError(`Unknown Battle Type`, battle);
    }
  }

  private findNationalities(battle: Battle): [Nationality, Nationality] {
    return [battle.def.id, battle.inv.id];
  }

  private findRegionName(battle: Battle): string {
    return battle.region.name;
  }
}

export class BattleAnalysisError extends Error {
  constructor(public message: string,
              public battle: Battle) {
    super(`${message}. ${JSON.stringify(battle)}`);
  }
}
