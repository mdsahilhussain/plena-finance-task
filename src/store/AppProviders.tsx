import { type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '../store';
import { Web3Provider } from './Web3Provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Web3Provider>{children}</Web3Provider>
    </ReduxProvider>
  );
}
