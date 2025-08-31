 import { portfolioActionTypes } from './portfolio.types';
import { coinActionTypes } from '../coin/coin.types';
import type { AppDispatch, RootState } from '../..';
import type { Coin } from '../../../types/redux.types';

export const addToWatchlist = (coins: Coin[]) => (dispatch: AppDispatch) => {
  const enrichedCoins: Coin[] = coins.map((coin) => ({
    ...coin,
    holdings: 0,
    value: 0,
  }));

  dispatch({ type: portfolioActionTypes.ADD_TO_WATCHLIST, payload: enrichedCoins });
  dispatch({ type: coinActionTypes.CLEAR_SELECTED_COINS });
};

export const removeFromWatchlist = (coinId: string) => ({
  type: portfolioActionTypes.REMOVE_FROM_WATCHLIST,
  payload: coinId,
});

export const updateHoldings = (coinId: string, holdings: number) => ({
  type: portfolioActionTypes.UPDATE_HOLDINGS,
  payload: { coinId, holdings },
});

export const updateWatchlistData =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { watchlist } = getState().portfolio;
    if (watchlist.length === 0) return;

    try {
      const ids = watchlist.map((coin) => coin.id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h`
      );

      if (!response.ok) throw new Error('Failed to update prices');
      const data: Coin[] = await response.json();

      dispatch({ type: portfolioActionTypes.UPDATE_WATCHLIST_DATA, payload: data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating watchlist:', message);
    }
  };
