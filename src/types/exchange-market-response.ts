export interface ExchangeMarketResponse {
  error: boolean;
  hideOffer: boolean;
  message: string;
  ecash: Ecash;
  gold: Ecash;
  page: string;
  currencyId: string;
  essentials: string;
  buy_mode: string;
}

export interface Ecash {
  id: string;
  value: string;
  citizen_id: string;
  currencyId: string;
  currency: string;
  currency_icon: string;
}
