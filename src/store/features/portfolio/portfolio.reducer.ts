/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Coin } from '../../../types/redux';
import { portfolioActionTypes, type PortfolioActionType } from './portfolio.types';

interface PortfolioState {
  watchlist: Coin[];
  lastUpdated: string | null;
}

const initialState: PortfolioState = {
  watchlist: [],
  lastUpdated: null,
};

interface Action {
  type: PortfolioActionType;
  payload?: any;
}

export const portfolioReducer = (
  state: PortfolioState = initialState,
  action: Action
): PortfolioState => {
  switch (action.type) {
    case portfolioActionTypes.ADD_TO_WATCHLIST: {
      return { ...state, watchlist: [...state.watchlist, ...action.payload] };
    }

    case portfolioActionTypes.REMOVE_FROM_WATCHLIST: {
      return {
        ...state,
        watchlist: state.watchlist.filter((coin) => coin.id !== action.payload),
      };
    }

    case portfolioActionTypes.UPDATE_HOLDINGS: {
      const updated = state.watchlist.map((coin) =>
        coin.id === action.payload.coinId
          ? {
              ...coin,
              holdings: action.payload.holdings,
              value: coin.current_price * action.payload.holdings,
            }
          : coin
      );
      return { ...state, watchlist: updated };
    }

    case portfolioActionTypes.UPDATE_WATCHLIST_DATA: {
      const updatedData = state.watchlist.map((coin) => {
        const newData = action.payload.find((c: Coin) => c.id === coin.id);
        if (newData) {
          return {
            ...coin,
            ...newData,
            holdings: coin.holdings,
            value: newData.current_price * (coin.holdings ?? 0),
          };
        }
        return coin;
      });

      return {
        ...state,
        watchlist: updatedData,
        lastUpdated: new Date().toISOString(),
      };
    }

    case portfolioActionTypes.SET_LAST_UPDATED: {
      return { ...state, lastUpdated: action.payload };
    }

    default:
      return state;
  }
};