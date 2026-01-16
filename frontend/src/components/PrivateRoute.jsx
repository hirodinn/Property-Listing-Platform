import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  // If user is logged in, render child routes (Outlet)
  // Otherwise, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
