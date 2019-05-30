import { BattleBridge } from './bridges/battle-bridge';
import { NetworkProxy } from './network-proxy';
import { ExchangeMarketBridge } from './bridges/exchange-market.bridge';
import { TrainBridge } from './bridges/train.bridge';
import { WorkBridge } from './bridges/work-bridge';
import { WeeklyChallengeBridge } from './bridges/weekly-challenge-bridge';
import { RewardCollectorBridge } from './bridges/reward-collector.bridge';
import { Dispatcher } from './dispatcher/dispatcher';
import { NaNError, sleep, time } from './utils';
import { EattingBridge } from './bridges/eatting-bridge';
import { StateService } from './state.service';
import { KeepaliveBridge } from './bridges/keepalive-bridge';
import { BattleAnalyzer } from './battle-algorithm/battle-analyzer';
import { BattleChooser } from './battle-algorithm/battle-chooser';
import { AttackConfigChooser } from './battle-algorithm/attack-config-chooser';
import { BattleFighter } from './battle-algorithm/battle-fighter';
import { TravelBridge } from './bridges/travel-bridge';
import * as log4js from 'log4js';
import { getLogger } from 'log4js';
import { EventReporter } from './server-connector/event-reporter';
import { ServerNetworkProxy } from './server-connector/server-network-proxy';
import { handleSignals } from './signals-handler';
import { DispatchJob, JobResponse } from './dispatcher/types';
import { JobStatus } from './server-connector/_models/job-status-request';

require('dotenv').config();

log4js.configure({
  appenders: {
    console: {type: 'stdout'},
    file: {type: 'dateFile', filename: 'logs/index.log', pattern: '.yyyy-MM-dd', compress: true}
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
const exchangeMarketBridge = new ExchangeMarketBridge(networkProxy, stateService);
const trainBridge = new TrainBridge(networkProxy, stateService);
const workBridge = new WorkBridge(networkProxy, stateService);
const weeklyChallengeBridge = new WeeklyChallengeBridge(networkProxy, stateService);
const rewardCollectorBridge = new RewardCollectorBridge(networkProxy);
const eattingBridge = new EattingBridge(networkProxy, stateService);
const keepaliveBridge = new KeepaliveBridge(networkProxy, stateService);
const battleBridge = new BattleBridge(networkProxy, stateService, eattingBridge);
const battleChooser = new BattleChooser(stateService, battleBridge);
const attackConfigChooser = new AttackConfigChooser(stateService);
const travelBridge = new TravelBridge(networkProxy, stateService);
const battleFighter = new BattleFighter(battleBridge, battleAnalyzer, battleChooser, attackConfigChooser, weeklyChallengeBridge, rewardCollectorBridge, travelBridge, stateService);
const serverNetworkProxy = new ServerNetworkProxy(stateService);
const serverDispatcher: Dispatcher = startServerDispatcher()
    .init();
const jobsDispatcher: Dispatcher = getJobsDispatcher()
    .init();
const eventReporter = new EventReporter(stateService, serverNetworkProxy);

handleSignals([jobsDispatcher, serverDispatcher]);

function getJobsDispatcher(): Dispatcher {
  const jobs: DispatchJob[] = [
    {
      id: 'token-refresher',
      name: 'Token refresher',
      timeInterval: time(14, 'minutes'),
      action: () => keepaliveBridge.refreshTokens(),
      afterAction: () => sleep(1000),
      handleError: async (job, error) => {
        await eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      }
    },
    {
      id: 'wc-refresher',
      name: 'Weekly challenge refresher',
      timeInterval: time(14, 'minutes'),
      action: () => weeklyChallengeBridge.refreshWeeklyChallengeInformation(),
      handleError: async (job, error) => {
        await eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      }
    },
    {
      // Eatting job must always start before attacking job, because it updates health state.
      id: 'eatting',
      name: 'Eat',
      timeInterval: time(7, 'minutes'), // every 7 minutes
      action: async () => {
        await eattingBridge.refreshEnergyData();
        await eattingBridge.eat();
        return JobResponse.success();
      },
      afterAction: () => sleep(2000),
      handleError: async (job, error) => {
        await eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      }
    },
    {
      id: 'work-daily',
      name: 'Work daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        const logger = getLogger('Work overtime checker');
        if (stateService.workedToday()) {
          logger.info('Already worked');
          return true;
        }

        return false;
      },
      action: () => workBridge.workDaily(),
      afterAction: () => sleep(2000)
    },
    {
      id: 'work-overtime-daily',
      name: 'Work overtime daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        const logger = getLogger('Work overtime checker');
        if (stateService.workedOvertimeToday()) {
          logger.info('Already worked today');
          return true;
        }
        return false;
      },
      action: () => workBridge.workOvertimeDaily(),
      afterAction: () => sleep(2000)
    },
    {
      id: 'work-production-daily',
      name: 'Work production daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        const logger = getLogger('Work Production checker');
        if (stateService.workedProductionToday()) {
          logger.info('Already worked today');
          return true;
        }

        /* We are not running production, because it uses too much hp, which we will use on fighting in epics.
        * Try work production 6 hours after day start */
        if (stateService.isWcStartDay() &&
            !stateService.dayTimeElapsed(time(6, 'hours'))) {
          logger.info('Not working. Must elapse at least 6 hours in wc start day.');
          // return true;
          return false;
        }

        return false;
      },
      action: () => workBridge.workProductionDaily(),
      afterAction: () => sleep(2000),
    },
    {
      id: 'train-daily',
      name: 'Train daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => stateService.trainedToday(),
      action: () => trainBridge.trainDaily(),
      afterAction: () => sleep(2000),
    },
    {
      id: 'buy-gold-daily',
      name: 'Buy Gold daily',
      timeInterval: time(14, 'minutes'),
      shouldStopRunning: () => {
        return stateService.boughtGoldToday();
      },
      action: () => exchangeMarketBridge.buyDailyGold(),
      handleError: async (job, error) => {
        await eventReporter.reportFatalError(job.id, job.name, error);
        return true;
      }
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

        // if (!stateService.workedToday() ||
        //     !stateService.workedOvertimeToday() ||
        //     !stateService.trainedToday()) {
        //   logger.info('Not fighting. Some daily tasks has not yet been completed');
        //   return true;
        // }

        /* Start attacking 4 hours after wc day start */
        if (!stateService.workedProductionToday() &&
            stateService.isWcStartDay() &&
            !stateService.dayTimeElapsed(time(4, 'hours'))) {
          logger.info('Not fighting. Production daily task has not yet been completed');
          return true;
        }

        return false;
      },
      action: () => battleFighter.tryFight()
    }
  ];

  const dispatcher = new Dispatcher('Jobs', jobs);

  dispatcher.onError(async (job, error) => {
    /* Nan errors are unpredictable, because we have no control over them and they can occur when 3rd party data changes */
    if (error instanceof NaNError) {
      await eventReporter.reportFatalError(job.id, job.name, error);
      return true;
    }

    await eventReporter.reportJobStatus({
      jobId: job.id,
      jobName: job.name,
      day: stateService.currentDay,
      timeInterval: job.timeInterval,
      status: JobStatus.ERROR,
      message: eventReporter.stringifyError(error)
    });

    return true;
  });

  dispatcher.onSuccess(async (job, jobResponse) => {
    await eventReporter.reportJobStatus({
      jobId: job.id,
      jobName: job.name,
      day: stateService.currentDay,
      timeInterval: job.timeInterval,
      status: jobResponse.status,
      message: jobResponse.message
    });

    return true;
  });


  return dispatcher;
}

function startServerDispatcher(): Dispatcher {
  return new Dispatcher('Server', [{
    id: 'status-reporter',
    name: 'Status Reporter',
    timeInterval: time(15, 'seconds'),
    action: async () => {
      await eventReporter.reportWorkerStatus();
      return JobResponse.success();
    },
    handleSuccess: async (job, jobResponse) => true,
    disableLog: true
  }]);
}
