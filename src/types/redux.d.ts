/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  holdings: number;
  value: number;
  [key: string]: any;
}
