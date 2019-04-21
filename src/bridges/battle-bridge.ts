import {
  BattleEndedError,
  JsonParsingError,
  LowHealthError,
  NetworkProxy,
  RateLimitError,
  UnknownError,
  WeaponNotChangedError
} from '../network-proxy';
import { StateService } from '../state.service';
import { AttackResponse } from '../types/attack-response';
import { EattingBridge } from './eatting-bridge';
import { Battle } from '../types/campains-response';
import { BattleType } from '../battle-algorithm/battle-analyzer-enums';
import { phase, sleep } from '../utils';
import { getLogger } from 'log4js';
import { WeaponType } from '../types/change-weapon-request';

export interface AttackConfig {
  battleId: string;
  sideId: string;
  killsLimit: number;
  battleType: BattleType;
  requiresTravel: boolean;
}

const logger = getLogger('BattleBridge');

export class BattleBridge {
  readonly RATE_LIMIT_MS = 800;

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService,
              private eattingBridge: EattingBridge) {

  }

  async getBattles(): Promise<Battle[]> {
    const response = await this.networkProxy.getCampainsList();

    return Object.values(response.battles);
  }

  @phase('Choose battle side')
  async chooseBattleSide(battleId: string, sideId: string) {
    return await this.networkProxy.chooseBattleSide(battleId, sideId);
  }

  @phase('Daily Order Reward Collect')
  async collectDailyOrderReward() {
    const response = await this.networkProxy.collectDailyOrderReward();
    if (!response.msg.completed) {
      logger.info('No reward to collect');
    }
    if (response.msg.completed && response.msg.successfullyRewarded) {
      logger.info('Already collected');
    }
    return response;
  }

  @phase('Change Weapon')
  async changeWeapon(battleId: string, battleType: BattleType) {
    let primaryWeapon: WeaponType;
    let secondaryWeapon: WeaponType;

    if (battleType === BattleType.TANK) {
      primaryWeapon = this.stateService.userConfig.tankPrimaryWeapon;
      secondaryWeapon = this.stateService.userConfig.tankSecondaryWeapon;
    } else {
      primaryWeapon = this.stateService.userConfig.airPrimaryWeapon;
      secondaryWeapon = this.stateService.userConfig.airSecondaryWeapon;
    }

    try {
      return await this.networkProxy.changeWeapon({
        battleId: battleId,
        customizationLevel: primaryWeapon
      });
    } catch (e) {
      if (e instanceof WeaponNotChangedError) {
        return await this.networkProxy.changeWeapon({
          battleId: battleId,
          customizationLevel: secondaryWeapon
        });
      }
    }

  }

  @phase('Get battle stats')
  async getBattleStats(battleId: string) {
    return this.networkProxy.getBattleStats(battleId);
  }

  @phase('Attacking')
  async startAttacking({battleId, sideId, killsLimit, battleType}: AttackConfig) {
    return new Promise((resolve, reject) => {
      let rateLimitTimeMs = this.RATE_LIMIT_MS;
      let killCount = 0;

      if (killsLimit <= 0) {
        logger.info(`Not starting the attack: Kill limit is ${killsLimit}`);
        resolve();
        return;
      }

      const attackFn = battleType === BattleType.AIR
          ? this.attackAir.bind(this, battleId, sideId)
          : this.attackTank.bind(this, battleId, sideId);

      const tick = () => setTimeout(loop, rateLimitTimeMs);

      const loop = async () => {
        try {
          const response = await attackFn();
          this.stateService.healthBarPrimary = response.details.wellness || 0;
          if (response.message === 'ENEMY_KILLED') {
            killCount += 1;
          }

          if (killCount >= killsLimit) {
            await attackStopHook(``);
            resolve();
            return;
          }

          tick();
        } catch (e) {
          if (e instanceof RateLimitError) {
            return handleRateLimitError();
          }

          if (e instanceof LowHealthError) {
            return await handleLowHealthError();
          }

          await attackStopHook(e);

          reject(e);
        }
      };

      const handleRateLimitError = () => {
        rateLimitTimeMs += 100;
        logger.warn(`Rate Limit Error: Increasing timer to ${rateLimitTimeMs} ms`);
        tick();
      };

      const handleLowHealthError = async () => {
        /* We only want to attack when secondar healthbar is high enough */
        if (this.stateService.healthBarSecondary < 60) {
          await attackStopHook(`Secondary health bar (${this.stateService.healthBarSecondary}) is not high enough to attack more`);
          resolve();
          return;
        }

        await this.eat();
        tick();
      };

      const attackStopHook = async (reason: string) => {
        logger.info(`Attack STOP: Killed ${killCount} of maximum ${killsLimit}. ${reason}`);

        await this.eat();
      };

      loop();
    });
  }

  private async eat() {
    /* It would not restore health when eatting immediately after attacking */
    await sleep(2000);
    return await this.eattingBridge.eat();
  }

  private async attackTank(battleId: string, sideId: string) {
    return this.attack(this.networkProxy.attackTank.bind(this.networkProxy, battleId, sideId));
  }

  private async attackAir(battleId: string, sideId: string) {
    return this.attack(this.networkProxy.attackAir.bind(this.networkProxy, battleId, sideId));
  }

  private async attack(attackFn: () => Promise<AttackResponse>) {
    try {
      const response = await attackFn();
      // logger.info(JSON.stringify(response));
      logger.info(`Attacked for ${response.user.givenDamage || 0} burning ${(response.hits || 0) * 10} HP`);

      return response;
    } catch (e) {
      if (e instanceof UnknownError) {
        if (e.body.message === 'SHOOT_LOCKOUT') {
          throw new RateLimitError();
        }
        if (e.body.message === 'Fight checks failed. LOW_HEALTH' || e.body.message === 'LOW_HEALTH') {
          throw new LowHealthError();
        }

        // todo: handleBattleEnd
      }

      if (e instanceof JsonParsingError) {
        if (e.body === 'Zone is not meant for aircraft') {
          throw new BattleEndedError(e);
        }
      }

      throw e;
    }
  }

}
