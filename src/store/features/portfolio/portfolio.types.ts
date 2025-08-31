export const portfolioActionTypes = {
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  UPDATE_HOLDINGS: 'UPDATE_HOLDINGS',
  UPDATE_WATCHLIST_DATA: 'UPDATE_WATCHLIST_DATA',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
} as const;

export type PortfolioActionType = (typeof portfolioActionTypes)[keyof typeof portfolioActionTypes];
