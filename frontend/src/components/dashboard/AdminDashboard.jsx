import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSystemMetrics, reset } from "../../features/admin/adminSlice";
import Spinner from "../Spinner";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { usersCount, propertiesCount, isLoading, isError, message } =
    useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getSystemMetrics());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {message}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            Total Users
          </h3>
          <p className="text-4xl font-bold text-blue-600">{usersCount}</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <h3 className="text-xl font-semibold text-orange-800 mb-2">
            Total Properties
          </h3>
          <p className="text-4xl font-bold text-orange-600">
            {propertiesCount}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          Manage Users
        </button>
        {/* Add more admin actions here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
