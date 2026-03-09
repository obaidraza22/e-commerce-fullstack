import { Outlet, Navigate } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoutes;
