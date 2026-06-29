import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { LoadingState } from "../common/ui";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState label="Checking your session" fullScreen />;
  }

  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />
  );
};

export default ProtectedRoute;
