import {
  attackAir,
  attackTank,
  buyGold,
  changeWeapon,
  chooseBattleSide,
  collectDailyOrderReward,
  collectDailyTaskReward,
  collectWeeklyChallengeReward,
  eat,
  getBattleStats,
  getCampaignsList,
  getCompaniesPage,
  getMarketExchange,
  getMobileEnergyData,
  getMobileUserData,
  getProfile,
  getWeeklyChallengeData,
  login,
  loginCredentialsMobile,
  loginTokenMobile,
  switchDivision,
  train,
  travel,
  TypedResponse,
  work,
  workOvertime,
  workProduction
} from './endpoints';
import { BuyGoldRequest } from './types/buy-gold-request';
import { Headers } from 'node-fetch';
import { ProductionFactory } from './types/work-request';
import { objArrToCompoundObj } from './utils';
import { JSDOM } from 'jsdom';
import { StateService } from './state.service';
import { TravelRequest } from './types/travel-request';
import { getLogger } from 'log4js';
import { ChangeWeaponRequest } from './types/change-weapon-request';
import { LoginCredentialsRequest } from './types/login-credentials-request';
import { LoginTokenRequest } from './types/login-token-request';
import { SwitchDivisionRequest } from './types/switch-division-request';

const logger = getLogger('NetworkProxy');

export class NetworkProxy {
  constructor(private stateService: StateService) {

  }

  private get erpk(): string {
    return this.stateService.erpk;
  }

  private set erpk(value: string) {
    this.stateService.erpk = value;
  }

  private get erpk_rm(): string {
    return this.stateService.erpk_rm;
  }

  private set erpk_rm(value: string){
    this.stateService.erpk_rm = value;
  }

  private get _token(): string {
    return this.stateService._token;
  }

  private set _token(value: string) {
    this.stateService._token = value;
  }

  async getMarketExchange() {
    return this.jsonResponseHandler(getMarketExchange(this.erpk, {
      _token: this._token,
      currencyId: 62,
      page: 0,
      personalOffers: 0
    }));
  }

  async getWeeklyChallengeData() {
    return await this.jsonResponseHandler(getWeeklyChallengeData(this.erpk));
  }

  async collectWeekklyChallengeReward(rewardId: string) {
    const response = await this.jsonResponseHandler(collectWeeklyChallengeReward(this.erpk, {
      rewardId: rewardId,
      _token: this._token
    }));

    if (response.status !== 'success') {
      throw new UnknownError(response);
    }

    return response;
  }

  async collectDailyTaskReward() {
    return this.jsonResponseHandler(collectDailyTaskReward(this.erpk, {
      _token: this._token
    }));
  }

  /**
   * Special case error handling.
   * When SUCCESS -> it doesn't have any response.
   * When FAIL -> it has json
   */
  async train() {
    let response: any;
    try {
      response = await this.jsonResponseHandler(train(this.erpk, {
        'grounds[0][id]': 140221,
        'grounds[0][train]': 1,
        'grounds[1][id]': 518828,
        'grounds[1][train]': 1,
        'grounds[2][id]': 1923950,
        'grounds[2][train]': 1,
        'grounds[3][id]': 915866,
        'grounds[3][train]': 1,
        _token: this._token
      }));
    } catch (e) {
      if (e instanceof JsonParsingError) {
        // success;
        return;
      }

      throw e;
    }

    this.handleJsonErrors(response);
  }

  async workOvertime() {
    const response = await this.jsonResponseHandler(workOvertime(this.erpk, {
      action_type: 'workOvertime',
      _token: this._token
    }));

    if (!response.status) {
      throw new UnknownError(response);
    }

    return response;
  }

  async work() {
    const response = await this.jsonResponseHandler(work(this.erpk, {
      action_type: 'work',
      _token: this._token
    }));

    if (!response.status) {
      throw new UnknownError(response);
    }

    return response;
  }

  async workProduction(factories: ProductionFactory[]) {
    const response = await this.jsonResponseHandler(workProduction(this.erpk, {
      action_type: 'production',
      _token: this._token,
      ...objArrToCompoundObj('companies', factories)
    }));

    if (!(response as any).status) {
      throw new UnknownError(response);
    }

    return response;
  }

  async getCompaniesPage() {
    return this.htmlResponseHandler(getCompaniesPage(this.erpk));
  }

  async buyGold(formData: BuyGoldRequest) {
    return this.jsonResponseHandler(buyGold(this.erpk, {
      ...formData,
      _token: this._token
    }));
  }

  async eat() {
    return this.jsonResponseHandler(eat(this.erpk, this._token));
  }

  async getCampainsList() {
    return this.jsonResponseHandler(getCampaignsList(this.erpk));
  }

  async generateToken() {
    return this.htmlResponseHandler(login(this.erpk_rm));
  }

  async attackTank(battleId: string, sideId: string) {
    return await this.jsonResponseHandler(attackTank(this.erpk, {
      battleId: battleId,
      sideId: sideId,
      _token: this._token
    }));

    // try {
    //
    // } catch (e) {
    //   handleErrorMessage(e, 'SHOOT_LOCKOUT', () => {
    //     throw new RateLimitError()
    //   });
    // }
  }

  async attackAir(battleId: string, sideId: string) {
    return await this.jsonResponseHandler(attackAir(this.erpk, {
      battleId: battleId,
      sideId: sideId,
      _token: this._token
    }));
  }

  async chooseBattleSide(battleId: string, sideId: string) {
    const response = await chooseBattleSide(this.erpk, battleId, sideId);

    if (response.status === 302 && response.headers.get('location') === `https://www.erepublik.com/en/military/battlefield/${battleId}`) {
      return response;
    }

    throw new UnknownError(`Status: ${response.status}, Payload: ${await response.text()}`);
  }

  async getProfile(userId: string) {
    return await this.jsonResponseHandler(getProfile(this.erpk, userId));
  }

  async collectDailyOrderReward() {
    return await this.jsonResponseHandler(collectDailyOrderReward(this.erpk, {
      action: 'check',
      _token: this._token
    }));
  }

  async travel(formData: TravelRequest) {
    return await this.jsonResponseHandler(travel(this.erpk, {
      ...formData,
      _token: this._token
    }));
  }

  async changeWeapon(formData: ChangeWeaponRequest) {
    const response = await this.jsonResponseHandler(changeWeapon(this.erpk, {
      ...formData,
      _token: this._token
    }));

    /* Double equals not triple. DO NOT CHANGE */
    if (response.weaponId != formData.customizationLevel) {
      throw new WeaponNotChangedError(formData);
    }

    return response;
  }

  async getBattleStats(battleId: string, division: number) {
    return await this.jsonResponseHandler(getBattleStats(this.erpk, battleId, division));
  }

  async getUserData() {
    return await this.jsonResponseHandler(getMobileUserData(this.erpk));
  }

  async getEnergyData() {
    return await this.jsonResponseHandler(getMobileEnergyData(this.erpk));
  }

  async loginCredentials(formData: LoginCredentialsRequest) {
    const response = await loginCredentialsMobile(formData);
    const body = await response.json();

    if (!body.id) {
      throw new AuthorizationError(`Credentials authorization failed. ${JSON.stringify(body)}`);
    }

    this.extractErpk_rm(response.headers);
    this.extractErpk(response.headers);

    return body;
  }

  async loginToken(formData: LoginTokenRequest) {
    const response = await loginTokenMobile(formData);
    const body = await response.json();

    this.handleJsonErrors(body);

    this.extractErpk(response.headers);

    return body;
  }

  async switchDivision(formData: SwitchDivisionRequest) {
    return this.jsonResponseHandler(switchDivision(this.erpk, {
      ...formData,
      _token: this._token
    }));
  }


  /* ------------------------------------------------------------- */
  private async jsonResponseHandler<T>(response: Promise<TypedResponse<T>>) {
    const resp = await response;

    // for now we don't need to save erpk, because this action is handling a separate job
    // this.saveErpk(resp.headers);

    let text: string;
    let payload: T;
    try {
      text = await resp.text();
      payload = JSON.parse(text);
    } catch (e) {
      logger.warn(text);
      throw new JsonParsingError(text, e);
    }

    this.handleJsonErrors(payload);

    return payload;
  }

  private async htmlResponseHandler<T>(response: Promise<TypedResponse<T>>) {
    const resp = await response;
    const payload = await resp.text();
    const dom = JSDOM.fragment(payload);

    this.saveErpk(resp.headers);

    this.handleHtmlErrors(dom, resp.headers, resp.url);

    this.saveToken(dom);

    return dom;
  }

  private extractErpk(headers: Headers) {
    const erpk = this.getToken('erpk', headers);
    if (!erpk) {
      throw new AuthorizationError(`Erpk not found`)
    }
    this.erpk = erpk;
  }

  private extractErpk_rm(headers: Headers) {
    const erpk_rm = this.getToken('erpk_rm', headers);
    if (!erpk_rm) {
      throw new AuthorizationError(`Erpk_rm not found`)
    }
    this.erpk_rm = erpk_rm;
  }


  private getToken(tokenName: string, headers: Headers): string {
    const setCookies = headers.get('set-cookie');

    const regex = new RegExp(tokenName + '=(\\w+);');
    const result = regex.exec(setCookies);
    if (result === null) {
      logger.warn(`${tokenName} cannot be found in set-cookie header`);
      return;
    }

    const token = result[1];

    return token;
  }

  private saveErpk(headers: Headers) {
    const setCookies = headers.get('set-cookie');

    const regex = /erpk=(\w+);/;
    const result = regex.exec(setCookies);
    if (result === null) {
      logger.warn('Erpk cannot be found in set-cookie header');
      return;
    }

    const newErpk = result[1];

    this.erpk = newErpk;
  }

  private saveToken(dom: DocumentFragment) {
    // language=CSS
    const tokenElement = dom.querySelector(`input[name='_token']`);
    if (!tokenElement) {
      logger.warn('_token cannot be found in the template: no hidden input node');
      return;
    }

    const token = tokenElement.attributes.getNamedItem('value').value;
    if (!token) {
      logger.warn('_token cannot be found in the template: input node value is null');
      return;
    }

    this._token = token;
  }

  private handleJsonErrors(payload: any) {
    if (typeof payload === 'string') {
      throw new CsrfError(payload);
    }

    if (payload.status === false && payload.message === 'captcha') {
      throw new CaptchaError();
    }

    if (payload.error || payload.status === false) {
      throw new UnknownError(payload);
    }
  }

  private handleHtmlErrors(dom: DocumentFragment, headers: Headers, url: string) {
    const location = headers.get('location');
    if (location) {
      throw new RedirectError(`${url} -> ${location}`);
    }

    // language=CSS
    const titleElement = dom.querySelector(`meta[name=title]`);

    const title = titleElement.attributes.getNamedItem('content').value;
    if (title === 'Free Online Multiplayer Strategy Game | eRepublik') {
      throw new InvalidErpkError(url);
    }
  }

}

export class UnknownError extends Error {
  constructor(public body: any) {
    super('Unknown Error ' + JSON.stringify(body));
  }
}

export class CsrfError extends Error {
  constructor(payload: any) {
    super(`Csrf Error: ${payload}`);
  }
}

export class JsonParsingError extends Error {
  constructor(public body: string, error: any) {
    super(`JSON parsing error: ${error}`);
  }
}

export class InvalidErpkError extends Error {
  constructor(msg: string = '') {
    super(`Invalid Erpk ${msg}`);
  }
}

export class CaptchaError extends Error {
  constructor() {
    super(`Captcha error`);
  }
}

export class RedirectError extends Error {
  constructor(url: string) {
    super(`Redirect Error: ${url}`);
  }
}

export class RateLimitError extends Error {
  constructor() {
    super(`Rate Limit Error`);
  }
}

export class LowHealthError extends Error {
  constructor() {
    super(`Low Health Error`);
  }
}

export class ElementNotFoundError extends Error {
  constructor(selector: string) {
    super(`Element (${selector}) cannot be found`);
  }
}

export class BattleEndedError extends Error {
  constructor(error: any) {
    super(`Battle Ended Error: ${error}`);
  }
}

export class WeaponNotChangedError extends Error {
  constructor(data: any) {
    super(`Weapon not changed ${JSON.stringify(data)}`);
  }
}

export class AuthorizationError extends Error {
  constructor(message: any) {
    super(`Authorizaiton Error: ${message}`);
  }
}
