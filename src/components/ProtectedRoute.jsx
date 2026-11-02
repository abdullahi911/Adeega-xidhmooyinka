import { Navigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '../services/db';

/**
 * ProtectedRoute Guard
 * Only permits access if the user has an active, valid 'admin' session.
 * Normal visitors are automatically redirected to /admin/login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuth = adminAuthService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

