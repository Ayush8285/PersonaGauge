import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader"; // Use your existing loader

const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />; // ⏳ Wait until auth state is fully restored
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
