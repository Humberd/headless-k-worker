import { ElementNotFoundError, NetworkProxy, RedirectError } from '../network-proxy';
import { StateService } from '../state.service';
import { phase } from '../utils';

export class KeepaliveBridge {
  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Refreshing tokens')
  async refreshTokens() {
    try {
      /* Acquires erpk */
      await this.networkProxy.generateToken();
    } catch (e) {
      /* Generating token always redirects */
      if (!(e instanceof RedirectError)) {
        throw e;
      }
    }

    /* Acquires _token */
    const companiesPageDom = await this.networkProxy.getCompaniesPage();

    if (!this.stateService.userId) {
      this.stateService.userId = this.getUserId(companiesPageDom);
    }

    this.stateService.healthRegen = this.getHealthRegen(companiesPageDom);
    this.stateService.currentDay = this.getDay(companiesPageDom);
    this.stateService.healthBarLimit = this.getHealthBarLimit(companiesPageDom);
  }

  private getUserId(dom: DocumentFragment): string {
    // language=CSS
    const elem = this.findElem(dom, 'a.user_name[href^="/en/citizen/profile/"]');

    const urlSegments = elem.attributes
        .getNamedItem('href')
        .value
        .split('/');

    return String(urlSegments[urlSegments.length - 1]);
  }

  private getHealthRegen(dom: DocumentFragment): number {
    // language=CSS
    const elem = this.findElem(dom, '#foodResetHoursContainer > strong');

    return Number(elem.textContent);
  }

  private getDay(dom: DocumentFragment): number {
    // language=CSS
    const elem = this.findElem(dom, '.eday > strong');

    const dayWithCommas = elem.textContent;
    const dayString = dayWithCommas.replace(',', '');

    return Number(dayString);
  }

  private getHealthBarLimit(dom: DocumentFragment): number {
    // language=CSS
    const elem = this.findElem(dom, '.health_bar > #current_health');

    // '900 / 1060' <- format
    const healthLabel = elem.textContent;

    const healthLimit = healthLabel.replace(' ', '')
        .split('/')[1];

    return Number(healthLimit);
  }

  private findElem(dom: DocumentFragment, selector: string): Element {
    const elem = dom.querySelector(selector);
    if (!elem) {
      throw new ElementNotFoundError(selector);
    }
    return elem;
  }
}
