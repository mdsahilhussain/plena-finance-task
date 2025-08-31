/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Coin } from '../../../types/redux';
import { coinActionTypes, type CoinActionTypes } from './coin.types';

interface CoinsState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  selectedCoins: Coin[];
}

const initialState: CoinsState = {
  coins: [],
  loading: false,
  error: null,
  selectedCoins: [],
};

interface Action {
  type: CoinActionTypes;
  payload?: any;
}

export const coinsReducer = (state: CoinsState = initialState, action: Action): CoinsState => {
  switch (action.type) {
    case coinActionTypes.SET_COINS:
      return { ...state, coins: action.payload, loading: false, error: null };

    case coinActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case coinActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case coinActionTypes.SET_SELECTED_COINS:
      return { ...state, selectedCoins: action.payload };

    case coinActionTypes.CLEAR_SELECTED_COINS:
      return { ...state, selectedCoins: [] };

    default:
      return state;
  }
};
