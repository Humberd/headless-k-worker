import { default as fetch, RequestInit, Response } from 'node-fetch';
import { EatResponse } from './types/eat-response';
import { AttackResponse } from './types/attack-response';
import { ProfileResponse } from './types/profile-response';
import { CampainsResponse } from './types/campains-response';
import { InventoryResponse } from './types/inventory-response';
import { BattleStatsResponse } from './types/battle-stats-response';
import { ActivateBoosterResponse } from './types/activate-booster-response';
import { ActivateBoosterRequest } from './types/activate-booster-request';
import { WorkResponse } from './types/work-response';
import { OvertimeWorkRequest, ProductionWorkRequest, WorkRequest } from './types/work-request';
import { ExchangeMarketResponse } from './types/exchange-market-response';
import { ExchangeMarketRequest } from './types/exchange-market-request';
import { BuyGoldRequest } from './types/buy-gold-request';
import { TrainingGroundsResponse } from './types/training-grounds-response';
import { WeeklyChallengeDataResponse } from './types/weekly-challenge-data-response';
import { WeeklyChallengeRewardCollectResponse } from './types/weekly-challenge-reward-collect-response';
import { WeeklyChallengeRewardCollectRequest } from './types/weekly-challenge-reward-collect-request';
import { DailyRewardResponse } from './types/daily-reward-response';
import { DailyRewardRequest } from './types/daily-reward-request';
import { BaseRequest } from './types/_base-request';
import { CollectDailyTaskRewardResponse } from './types/collect-daily-task-reward-response';
import { AttackRequest } from './types/attack-request';
import { TravelRequest } from './types/travel-request';
import { TravelResponse } from './types/travel-response';
import { URLSearchParams } from 'url';
import { ChangeWeaponRequest } from './types/change-weapon-request';
import { ChangeWeaponResponse } from './types/change-weapon-response';

interface JsonRequestConfig {
  erpk?: string;
  erpk_rm?: string;
  method: 'GET' | 'POST',
  body?: any
}

export interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

async function request<T>(url: string, config?: JsonRequestConfig): Promise<TypedResponse<T>> {
  const cookies = buildCookies({
    erpk: config.erpk,
    erpk_rm: config.erpk_rm
  });

  const reqestConfig: RequestInit = {
    method: config.method || 'GET',
    headers: {
      cookie: cookies,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
    },
    body: config.body ? new URLSearchParams(config.body).toString() : null,
    redirect: 'manual'
  };

  // console.debug(`Request config:\n${JSON.stringify({url, ...reqestConfig}, null, 2)}`);

  return fetch(url, reqestConfig);
}

function buildCookies(cookiesObj: {[key: string]: string}): string {
  const goodCookies: any = {};
  for (const [key, value] of Object.entries(cookiesObj)) {
    if (value) {
      goodCookies[key] = value;
    }
  }

  return new URLSearchParams(goodCookies).toString();
}

export async function getProfile(erpk: string, userId: string) {
  return request<ProfileResponse>(`https://www.erepublik.com/en/main/citizen-profile-json/${userId}`, {
    method: 'GET',
    erpk: erpk
  });
}

export async function getCampaignsList(erpk: string) {
  return request<CampainsResponse>(`https://www.erepublik.com/en/military/campaigns-new/`, {
    method: 'GET',
    erpk: erpk
  });
}

export async function getInventory() {
  return request<InventoryResponse>(`https://www.erepublik.com/en/economy/inventory-items/`);
}

export async function getBattleStats(battleId: string) {
  return request<BattleStatsResponse>(`https://www.erepublik.com/en/military/nbp-stats/${battleId}/4`);
}

export async function attackTank(erpk: string, formData: AttackRequest) {
  return request<AttackResponse>(`https://www.erepublik.com/en/military/fight-shooot/${formData.battleId}`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function attackAir(erpk: string, formData: AttackRequest) {
  return request<AttackResponse>(`https://www.erepublik.com/en/military/fight-shoooot/${formData.battleId}`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function chooseBattleSide(erpk: string, battleId: string, sideId: string) {
  return request(`https://www.erepublik.com/en/military/battlefield-choose-side/${battleId}/${sideId}`, {
    method: 'GET',
    erpk: erpk
  })
}

export async function eat(erpk: string, _token: string) {
  return request<EatResponse>(`https://www.erepublik.com/en/main/eat?format=json&_token=${_token}&buttonColor=blue`, {
    method: 'POST',
    erpk: erpk
  });
}

export async function activateBooster(formData: ActivateBoosterRequest) {
  return request<ActivateBoosterResponse>(`https://www.erepublik.com/en/military/fight-activateBooster`);
}

export async function work(erpk: string, formData: WorkRequest) {
  return request<WorkResponse>(`https://www.erepublik.com/en/economy/work`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function workOvertime(erpk: string, formData: OvertimeWorkRequest) {
  return request<WorkResponse>(`https://www.erepublik.com/en/economy/workOvertime`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function workProduction(erpk: string, formData: ProductionWorkRequest) {
  return request(`https://www.erepublik.com/en/economy/work`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function buyGold(erpk: string, formData: BuyGoldRequest) {
  return request<ExchangeMarketResponse>(`https://www.erepublik.com/en/economy/exchange/purchase/`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function getMarketExchange(erpk: string, formData: ExchangeMarketRequest) {
  return request<ExchangeMarketResponse>(`https://www.erepublik.com/en/economy/exchange/retrieve/`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function train(erpk: string, formData: any) {
  return request(`https://www.erepublik.com/en/economy/train`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function getTrainingGrounds(erpk: string) {
  return request<TrainingGroundsResponse>(`https://www.erepublik.com/en/main/training-grounds-json`, {
    method: 'POST',
    erpk: erpk
  });
}

export async function getWeeklyChallengeData(erpk: string) {
  return request<WeeklyChallengeDataResponse>(`https://www.erepublik.com/en/main/weekly-challenge-data`, {
    method: 'GET',
    erpk: erpk
  });
}

export async function collectWeeklyChallengeReward(erpk: string, formData: WeeklyChallengeRewardCollectRequest) {
  return request<WeeklyChallengeRewardCollectResponse>(`https://www.erepublik.com/en/main/weekly-challenge-collect-reward`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function collectDailyTaskReward(erpk: string, formData: BaseRequest) {
  return request<CollectDailyTaskRewardResponse>(`https://www.erepublik.com/en/main/daily-tasks-reward`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function collectDailyOrderReward(erpk: string, formData: DailyRewardRequest) {
  return request<DailyRewardResponse>(`https://www.erepublik.com/en/military/group-missions`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  });
}

export async function travel(erpk: string, formData: TravelRequest) {
  return request<TravelResponse>(`https://www.erepublik.com/en/main/travel/`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  })
}

export async function changeWeapon(erpk: string, formData: ChangeWeaponRequest) {
  return request<ChangeWeaponResponse>(`https://www.erepublik.com/en/military/change-weapon`, {
    body: formData,
    method: 'POST',
    erpk: erpk
  })
}

/************************ STATIC PAGES *********************/

export async function login(erpk_rm: string) {
  return request(`https://www.erepublik.com/en/login`, {
    method: 'GET',
    erpk_rm: erpk_rm
  });
}

/**
 * @deprecated Don't use this endpoint, because it requires some 'accept' headers, which other pages don't
 */
export async function getIndexPage(erpk: string) {
  return request(`https://www.erepublik.com/en`, {
    method: 'GET',
    erpk: erpk
  });
}

export async function getCompaniesPage(erpk: string) {
  return request(`https://www.erepublik.com/en/economy/myCompanies`, {
    method: 'GET',
    erpk: erpk,
  });
}

