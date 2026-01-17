import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import OwnerDashboard from "../components/dashboard/OwnerDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-text-main)]">
        Dashboard
      </h1>

      {user.role === "admin" && <AdminDashboard />}
      {user.role === "owner" && <OwnerDashboard />}
      {user.role === "user" && <UserDashboard />}
    </div>
  );
};

export default Dashboard;
