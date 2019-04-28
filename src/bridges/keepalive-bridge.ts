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
