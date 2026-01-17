import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSystemMetrics,
  getAllUsers,
  getAllProperties,
  reset,
} from "../../features/admin/adminSlice";
import Spinner from "../Spinner";
import { FaUsers, FaBuilding, FaSearch, FaArrowLeft } from "react-icons/fa";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    usersCount,
    propertiesCount,
    usersList,
    propertiesList,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.admin);

  const [activeView, setActiveView] = useState("overview"); // overview, users, properties

  useEffect(() => {
    dispatch(getSystemMetrics());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleViewUsers = () => {
    dispatch(getAllUsers());
    setActiveView("users");
  };

  const handleViewProperties = () => {
    dispatch(getAllProperties());
    setActiveView("properties");
  };

  if (isLoading) return <Spinner />;

  // Don't return early on error, show error inside the dashboard layout
  // if (isError) return <div className="text-red-500">Error: {message}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Admin Dashboard
        </h2>
        {activeView !== "overview" && (
          <button
            onClick={() => setActiveView("overview")}
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] font-medium"
          >
            <FaArrowLeft /> Back to Overview
          </button>
        )}
      </div>

      {isError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users Card */}
          <div
            onClick={handleViewUsers}
            className="bg-blue-50 p-6 rounded-xl border border-blue-100 cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-800">
                Total Users
              </h3>
              <FaUsers className="text-3xl text-blue-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-4xl font-bold text-blue-600">{usersCount}</p>
            <p className="text-sm text-blue-400 mt-2">Click to view details</p>
          </div>

          {/* Properties Card */}
          <div
            onClick={handleViewProperties}
            className="bg-orange-50 p-6 rounded-xl border border-orange-100 cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-orange-800">
                Total Properties
              </h3>
              <FaBuilding className="text-3xl text-orange-300 group-hover:text-orange-500 transition" />
            </div>
            <p className="text-4xl font-bold text-orange-600">
              {propertiesCount}
            </p>
            <p className="text-sm text-orange-400 mt-2">
              Click to view details
            </p>
          </div>
        </div>
      )}

      {activeView === "users" && (
        <div>
          <h3 className="text-xl font-bold mb-4">All Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Joined</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {Array.isArray(usersList) && usersList.length > 0 ? (
                  usersList.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6 whitespace-nowrap font-medium">
                        {user.name}
                      </td>
                      <td className="py-3 px-6">{user.email}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`py-1 px-3 rounded-full text-xs ${user.role === "admin" ? "bg-purple-200 text-purple-600" : user.role === "owner" ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === "properties" && (
        <div>
          <h3 className="text-xl font-bold mb-4">All Properties</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Owner</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {Array.isArray(propertiesList) && propertiesList.length > 0 ? (
                  propertiesList.map((property) => (
                    <tr
                      key={property._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6 whitespace-nowrap font-medium truncate max-w-xs">
                        {property.title}
                      </td>
                      <td className="py-3 px-6">
                        {property.owner?.name || "Unknown"}
                      </td>
                      <td className="py-3 px-6">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`py-1 px-3 rounded-full text-xs ${property.status === "published" ? "bg-green-200 text-green-600" : property.status === "draft" ? "bg-yellow-200 text-yellow-600" : "bg-red-200 text-red-600"}`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
