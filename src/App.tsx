import { AppProviders } from './store/AppProviders';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}