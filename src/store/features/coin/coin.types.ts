export const coinActionTypes = {
  SET_COINS: 'SET_COINS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_COINS: 'SET_SELECTED_COINS',
  CLEAR_SELECTED_COINS: 'CLEAR_SELECTED_COINS',
} as const;

export type CoinActionTypes = (typeof coinActionTypes)[keyof typeof coinActionTypes];
