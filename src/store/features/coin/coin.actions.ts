/* eslint-disable @typescript-eslint/no-explicit-any */
import { coinActionTypes } from "./coin.types";
import type { AppDispatch, RootState } from '../..';

export const fetchCoins = () => async (dispatch: AppDispatch) => {
  dispatch({ type: coinActionTypes.SET_LOADING, payload: true });
  dispatch({ type: coinActionTypes.SET_ERROR, payload: null });

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h"
    );
    if (!response.ok) throw new Error("Failed to fetch coins");

    const data = await response.json();
    dispatch({ type: coinActionTypes.SET_COINS, payload: data });
  } catch (error: any) {
    dispatch({ type: coinActionTypes.SET_ERROR, payload: error.message });
  } finally {
    dispatch({ type: coinActionTypes.SET_LOADING, payload: false });
  }
};

export const toggleCoinSelection = (coin: any) => 
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { selectedCoins } = getState().coins;
    const isSelected = selectedCoins.some((c) => c.id === coin.id);

    if (isSelected) {
      dispatch({
        type: coinActionTypes.SET_SELECTED_COINS,
        payload: selectedCoins.filter((c) => c.id !== coin.id),
      });
    } else {
      dispatch({
        type: coinActionTypes.SET_SELECTED_COINS,
        payload: [...selectedCoins, coin],
      });
    }
};