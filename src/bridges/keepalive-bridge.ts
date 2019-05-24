import { ElementNotFoundError, NetworkProxy } from '../network-proxy';
import { StateService } from '../state.service';
import { phase } from '../utils';
import { UserDataResponse } from '../types/user-data-response';
import { getLogger } from 'log4js';

const logger = getLogger('KeepaliveBridge');

export class KeepaliveBridge {
  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Login by credentials')
  async loginCredentials() {
    return await this.networkProxy.loginCredentials({
      email: this.stateService.email,
      password: this.stateService.password
    });
  }

  @phase('Login by token')
  async loginToken() {
    return await this.networkProxy.loginToken({
      erpk_rm: this.stateService.erpk_rm
    })
  }

  @phase('Refreshing tokens')
  async refreshTokens() {
    let response: UserDataResponse;
    if (this.stateService.erpk_rm) {
      response = await this.loginToken();
    } else {
      response = await this.loginCredentials();
    }

    this.stateService._token = response.csrf;
    this.stateService.userId = String(response.id);
    this.stateService.currentCountryLocationId = response.citizenshipCountryId;


    /* Acquires _token */
    const companiesPageDom = await this.networkProxy.getCompaniesPage();

    this.stateService.currentDay = this.getDay(companiesPageDom);
  }

  private getDay(dom: DocumentFragment): number {
    // language=CSS
    const elem = this.findElem(dom, '.eday > strong');

    const dayWithCommas = elem.textContent;
    const dayString = dayWithCommas.replace(',', '');

    return Number(dayString);
  }

  private findElem(dom: DocumentFragment, selector: string): Element {
    const elem = dom.querySelector(selector);
    if (!elem) {
      throw new ElementNotFoundError(selector);
    }
    return elem;
  }
}
