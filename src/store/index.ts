import { legacy_createStore as createStore, combineReducers, applyMiddleware, type UnknownAction } from 'redux';
import  {thunk as thunkMiddleware, type ThunkDispatch}  from 'redux-thunk';

import { portfolioReducer } from './features/portfolio/portfolio.reducer';
import { coinsReducer } from './features/coin/coin.reducer';

// Load state from localStorage
const loadState = (): Partial<RootState> => {
  try {
    const serializedState = localStorage.getItem('cryptoState');
    if (!serializedState) {
      return {
        portfolio: { watchlist: [], lastUpdated: null },
        coins: { coins: [], loading: false, error: null, selectedCoins: [] },
      };
    }
    const parsed = JSON.parse(serializedState);
    return {
      portfolio: {
        watchlist: parsed.portfolio?.watchlist || [],
        lastUpdated: parsed.portfolio?.lastUpdated || null,
      },
      coins: {
        coins: [], // not persisted
        loading: false,
        error: null,
        selectedCoins: parsed.coins?.selectedCoins || [],
      },
    };
  } catch {
    return {
      portfolio: { watchlist: [], lastUpdated: null },
      coins: { coins: [], loading: false, error: null, selectedCoins: [] },
    };
  }
};

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const stateToPersist = {
      portfolio: state.portfolio,
      coins: { selectedCoins: state.coins.selectedCoins },
    };
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem('cryptoState', serializedState);
  } catch (error) {
    console.warn('Failed to save state:', error);
  }
};

const rootReducer = combineReducers({
  coins: coinsReducer,
  portfolio: portfolioReducer,
});

export const store = createStore(rootReducer, loadState(), applyMiddleware(thunkMiddleware));

// Persist store changes
store.subscribe(() => {
  saveState(store.getState());
});

// Types
export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
export type AppStore = typeof store


