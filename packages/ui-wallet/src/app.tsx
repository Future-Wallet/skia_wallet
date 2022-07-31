import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import RequireInitialization from './components/require_initialization';
import Home from './screens/home';
import Initialization from './screens/initizalization';
import { routes } from './utils/routes';

export default function App(): JSX.Element {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={routes.home} state={{ from: location }} replace />
        }
      />
      <Route
        path={`/${routes.home}`}
        element={
          <RequireInitialization>
            <Home />
          </RequireInitialization>
        }
      />
      <Route path={`/${routes.initialization}`} element={<Initialization />} />
    </Routes>
  );
}
