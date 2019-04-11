import { BaseRequest } from './_base-request';

export interface BuyGoldRequest extends BaseRequest{
  offerId: string;
  amount: 10;
  page: 0;
  currencyId: 62; //gold
}
