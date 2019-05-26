import { NetworkProxy } from '../network-proxy';
import { JSDOM } from 'jsdom';
import { handleErrorMessage, phase } from '../utils';
import { getLogger } from 'log4js';
import { JobResponse } from '../dispatcher/types';
import { StateService } from '../state.service';

interface GoldExchangeOffer {
  id: string;
  amount: number;
  price: number;
}

const logger = getLogger('ExchangeMarketBridge');

export class ExchangeMarketBridge {

  constructor(private networkProxy: NetworkProxy,
              private stateService: StateService) {

  }

  @phase('Daily gold exchange')
  async buyDailyGold(): Promise<JobResponse> {
    // todo: add handling `This exchange offer does not exist.` error message
    const offers = await this.getOffers();

    const offersOf10Gold = offers.filter(it => it.amount >= 10);
    if (offersOf10Gold.length === 0) {
      throw new NoGoldOf10Offers('No valid 10 gold offer.\n' + JSON.stringify(offers));
    }

    try {
      const response = await this.networkProxy.buyGold({
        amount: 10,
        currencyId: 62,
        page: 0,
        offerId: offersOf10Gold[0].id
      });

      logger.info(`Bought 10 gold for ${(offersOf10Gold[0].price * 10)} PLN. Current Gold: ${response.gold.value}. Current PLN: ${response.ecash.value}.`);
      this.stateService.lastGoldBuyDay = this.stateService.currentDay;

      return JobResponse.success();
    } catch (e) {
      return handleErrorMessage(e, 'Citizens cannot acquire more than 10 Gold per day through Monetary Market and Donations. You already reached the maximum limit.', () => {
        logger.info('Already bought Gold today');
        this.stateService.lastGoldBuyDay = this.stateService.currentDay;
        return JobResponse.alreadyDone('Already bought Gold today');
      });
    }
  }

  private async getOffers(): Promise<GoldExchangeOffer[]> {
    const exchangeJSON = await this.networkProxy.getMarketExchange();
    return this.parseTemplate(exchangeJSON.buy_mode);
  }


  private parseTemplate(template: string): GoldExchangeOffer[] {
    const offers: GoldExchangeOffer[] = [];

    const dom = JSDOM.fragment(template);

    // language=CSS
    const rows = dom.querySelectorAll('table.exchange_offers  tr:nth-child(n+3)');
    rows.forEach(row => {
      const offer: GoldExchangeOffer = {
        // language=CSS
        amount: Number(row.querySelector(`td.ex_amount span`).textContent.trim()),
        // language=CSS
        price: Number(row.querySelector(`td.ex_rate > [id^=exchange_rate] > span`).textContent.trim()),
        // language=CSS
        id: row.querySelector(`button[id^=purchase]`).attributes.getNamedItem('id').value
      };

      const idRegex = /purchase_(\d+)/;
      offer.id = idRegex.exec(offer.id)[1];

      offers.push(offer);
    });


    return offers;
  }

}

export class NoGoldOf10Offers extends Error {

}
