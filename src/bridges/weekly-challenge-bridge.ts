import { NetworkProxy } from '../network-proxy';
import { Status } from '../types/weekly-challenge-data-response';
import { phase } from '../utils';
import { StateService } from '../state.service';
import { getLogger } from 'log4js';

const logger = getLogger('WeeklyChallengeBridge');

export class WeeklyChallengeBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Weekly Challenge rewards collect')
  async collectAllRewards() {
    const wcData = await this.getWeeklyChallengeData();

    const completedRewards = wcData.rewards.normal.filter(it => it.status === Status.Completed);
    if (completedRewards.length === 0) {
      logger.info('No rewards to collect');
      return;
    }

    const requests = completedRewards
        .map(it =>
            this.networkProxy.collectWeekklyChallengeReward(String(it.id))
                .then(() => logger.info(`Collected ${it.icon}`))
                .catch(() => logger.warn(`Failed to collect ${it.icon}`))
        );

    await Promise.all(requests);

    logger.info(`Collected ${requests.length} rewards`);
  }

  @phase('Refresh Weekly Challenge Information')
  async refreshWeeklyChallengeInformation() {
    return await this.getWeeklyChallengeData();
  }

  async getWeeklyChallengeData() {
    const response = await this.networkProxy.getWeeklyChallengeData();

    this.stateService.weeklyChallengeTimeLeftMs = response.timeLeft * 1000;
    this.stateService.dayTimeLeftMs = this.calculateRemainingDayTimeMs(this.stateService.weeklyChallengeTimeLeftMs);

    return response;
  }

  private calculateRemainingDayTimeMs(wcTimeLeftMs: number): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return wcTimeLeftMs % msInDay;
  }

}
