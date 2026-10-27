import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageSkeleton } from './LoadingSkeleton';

/**
 * ProtectedRoute — route guard that redirects unauthenticated users to /login.
 * Saves the attempted path so the login page can redirect back after success.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  /* Show skeleton while auth state is being determined */
  if (loading) {
    return <PageSkeleton />;
  }

  /* Redirect to login, passing current path as state */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
