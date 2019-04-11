import { BattleBridge } from './bridges/battle-bridge';
import { NetworkProxy } from './network-proxy';
import { ExchangeMarketBridge } from './bridges/exchange-market.bridge';
import { TrainBridge } from './bridges/train.bridge';
import { WorkBridge } from './bridges/work-bridge';
import { WeeklyChallengeBridge } from './bridges/weekly-challenge-bridge';
import { RewardCollectorBridge } from './bridges/reward-collector.bridge';
import { Dispatcher, DispatchJob } from './dispatcher';
import { sleep, time } from './utils';
import { EattingBridge } from './bridges/eatting-bridge';
import { StateService } from './state.service';
import { KeepaliveBridge } from './bridges/keepalive-bridge';
import { BattleAnalyzer } from './battle-algorithm/battle-analyzer';
import { ProfileBridge } from './bridges/profile-bridge';
import { BattleChooser } from './battle-algorithm/battle-chooser';
import { AttackConfigChooser } from './battle-algorithm/attack-config-chooser';
import { BattleFighter } from './battle-algorithm/battle-fighter';
import { TravelBridge } from './bridges/travel-bridge';
import * as log4js from 'log4js';
import { getLogger } from 'log4js';
import { EventReporter } from './server-connector/event-reporter';
import { ServerNetworkProxy } from './server-connector/server-network-proxy';
import { handleSignals } from './signals-handler';

require('dotenv').config();

log4js.configure({
  appenders: {
    console: {type: 'stdout'},
    file: {type: 'file', filename: 'logs/index.log'}
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: 'DEBUG',
    }
  }
});

const stateService = new StateService();
const battleAnalyzer = new BattleAnalyzer(stateService);
const networkProxy = new NetworkProxy(stateService);
const exchangeMarketBridge = new ExchangeMarketBridge(networkProxy);
const trainBridge = new TrainBridge(networkProxy, stateService);
const workBridge = new WorkBridge(networkProxy, stateService);
const weeklyChallengeBridge = new WeeklyChallengeBridge(networkProxy, stateService);
const rewardCollectorBridge = new RewardCollectorBridge(networkProxy);
const eattingBridge = new EattingBridge(networkProxy, stateService);
const keepaliveBridge = new KeepaliveBridge(networkProxy, stateService);
const battleBridge = new BattleBridge(networkProxy, stateService, eattingBridge);
const profileBridge = new ProfileBridge(networkProxy, stateService);
const battleChooser = new BattleChooser(stateService);
const attackConfigChooser = new AttackConfigChooser(stateService);
const travelBridge = new TravelBridge(networkProxy);
const battleFighter = new BattleFighter(battleBridge, battleAnalyzer, battleChooser, attackConfigChooser, weeklyChallengeBridge, rewardCollectorBridge, travelBridge, stateService);
const serverNetworkProxy = new ServerNetworkProxy(stateService);
const serverDispatcher: Dispatcher = startServerDispatcher().init();
const jobsDispatcher: Dispatcher = getJobsDispatcher()
    // .init();
const eventReporter = new EventReporter(jobsDispatcher, stateService, serverNetworkProxy);

handleSignals(jobsDispatcher);

function getJobsDispatcher(): Dispatcher {
  const jobs: DispatchJob[] = [
    {
      id: 'token-refresher',
      name: 'Token refresher',
      timeInterval: time(14, 'minutes'),
      handleError: async (job, error) => {
        eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      },
      actions: [
        // () => {
        //   throw new Error('test error just in case');
        // },
        () => keepaliveBridge.refreshTokens(),
        () => sleep(1000)
      ]
    },
    {
      id: 'profile-refresher',
      name: 'Profile refresher',
      timeInterval: time(14, 'minutes'),
      handleError: async (job, error) => {
        eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      },
      actions: [
        () => profileBridge.refreshProfileInformation()
      ]
    },
    {
      id: 'wc-refresher',
      name: 'Weekly challenge refresher',
      timeInterval: time(14, 'minutes'),
      handleError: async (job, error) => {
        eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      },
      actions: [
        () => weeklyChallengeBridge.refreshWeeklyChallengeInformation()
      ]
    },
    {
      // Eatting job must always start before attacking job, because it updates health state.
      id: 'eatting',
      name: 'Eat',
      timeInterval: time(7, 'minutes'), // every 7 minutes
      handleError: async (job, error) => {
        eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      },
      actions: [
        () => eattingBridge.eat(),
        () => sleep(2000)
      ]
    },
    {
      id: 'work-daily',
      name: 'Work daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        return stateService.workedToday();
      },
      actions: [
        () => workBridge.workDaily(),
        () => sleep(2000),
      ]
    },
    {
      id: 'work-overtime-daily',
      name: 'Work overtime daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        return stateService.workedOvertimeToday();
      },
      actions: [
        () => workBridge.workOvertimeDaily(),
        () => sleep(2000),
      ]
    },
    {
      id: 'work-production-daily',
      name: 'Work production daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        const logger = getLogger('Work Production checker');
        if (stateService.workedProductionToday()) {
          return true;
        }

        /* We are not running production, because it uses too much hp, which we will use on fighting in epics.
        * Try work production 6 hours after day start */
        if (stateService.isWcStartDay() &&
            !stateService.dayTimeElapsed(time(6, 'hours'))) {
          logger.info('Not working. Must elapse at least 6 hours in wc start day.');
          return true;
        }

        return false;
      },
      actions: [
        () => workBridge.workProductionDaily(),
        () => sleep(2000),
      ]
    },
    {
      id: 'train-daily',
      name: 'Train daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        return stateService.trainedToday();
      },
      actions: [
        () => trainBridge.trainDaily(),
        () => sleep(2000),
      ]
    },
    {
      id: 'fighting',
      name: 'Fight',
      timeInterval: time(1, 'minutes'),
      shouldStopRunning: () => {
        const logger = getLogger('Fight checker');

        const fullHpRegenTime = stateService.calcTimeToFullSecondaryHp();
        if (stateService.dayTimeLeftMs <= fullHpRegenTime) {
          logger.info('Not fighting. Waiting with HP regen to the next day');
          return true;
        }

        if (!stateService.workedToday() ||
            !stateService.workedOvertimeToday() ||
            !stateService.trainedToday()) {
          logger.info('Not fighting. Some daily tasks has not yet been completed');
          return true;
        }

        /* Start attacking 4 hours after wc day start */
        if (!stateService.workedProductionToday() &&
            stateService.isWcStartDay() &&
            !stateService.dayTimeElapsed(time(4, 'hours'))) {
          logger.info('Not fighting. Production daily task has not yet been completed');
          return true;
        }

        return false;
      },
      actions: [
        () => battleFighter.tryFight()
      ]
    }
  ];

  const dispatcher = new Dispatcher('Jobs', jobs);

  dispatcher.onError(async (job, error) => {
    eventReporter.reportNormalError(job.id, job.name, error);
    return false;
  });


  return dispatcher;
}

function startServerDispatcher(): Dispatcher {
  const dispatcher = new Dispatcher('Server', [{
    id: 'status-reporter',
    name: 'Status Reporter',
    timeInterval: time(15, 'seconds'),
    actions: [
      () => eventReporter.reportStatus()
    ]
  }]);

  return dispatcher;
}
