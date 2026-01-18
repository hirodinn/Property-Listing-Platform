import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSystemMetrics,
  getAllUsers,
  getAllProperties,
  getAllTours,
  reset,
} from "../../features/admin/adminSlice";
import Spinner from "../Spinner";
import {
  FaUsers,
  FaBuilding,
  FaSearch,
  FaArrowLeft,
  FaClock,
  FaCheck,
  FaTimes,
  FaCalendarCheck,
  FaUserShield,
  FaUserTie,
  FaUser,
} from "react-icons/fa";
import {
  approveProperty,
  rejectProperty,
} from "../../features/properties/propertySlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    usersCount,
    propertiesCount,
    toursCount,
    usersList,
    propertiesList,
    toursList,
    pendingProperties: initialPendingCount,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.admin);

  // View state
  const [activeView, setActiveView] = useState("overview"); // overview, users, properties, pending, tours

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

  const handleViewPending = () => {
    dispatch(getAllProperties());
    setActiveView("properties"); // Shift to properties view but maybe filter? Or keep pending view.
    // User wants boxes to not have routes but show details.
    // Let's keep 'pending' as a view if that helps, or just make it go to properties and highlight pending.
    // Actually, user said 4 boxes in overview, one of which is pending.
    setActiveView("pending");
  };

  const handleViewTours = () => {
    dispatch(getAllTours());
    setActiveView("tours");
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this property?")) {
      await dispatch(approveProperty(id));
      dispatch(getAllProperties()); // Refresh list
      dispatch(getSystemMetrics()); // Refresh metrics
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this property?")) {
      await dispatch(rejectProperty(id));
      dispatch(getAllProperties()); // Refresh list
      dispatch(getSystemMetrics()); // Refresh metrics
    }
  };

  if (isLoading) return <Spinner />;

  // Don't return early on error, show error inside the dashboard layout
  // if (isError) return <div className="text-red-500">Error: {message}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-primary)">
          Admin Dashboard
        </h2>
        {activeView !== "overview" && (
          <button
            onClick={() => setActiveView("overview")}
            className="flex items-center gap-2 text-gray-600 hover:text-(--color-primary) font-medium"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Users Card */}
          <div
            onClick={handleViewUsers}
            className="bg-blue-50 p-6 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-blue-800">Users</h3>
              <FaUsers className="text-2xl text-blue-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-4xl font-black text-blue-600">{usersCount}</p>
            <p className="text-xs text-blue-400 mt-2 font-medium">
              Manage system roles &rarr;
            </p>
          </div>

          {/* Properties Card */}
          <div
            onClick={handleViewProperties}
            className="bg-orange-50 p-6 rounded-2xl border border-orange-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-orange-800">Properties</h3>
              <FaBuilding className="text-2xl text-orange-300 group-hover:text-orange-500 transition" />
            </div>
            <p className="text-4xl font-black text-orange-600">
              {propertiesCount}
            </p>
            <p className="text-xs text-orange-400 mt-2 font-medium">
              View all listings &rarr;
            </p>
          </div>

          {/* Pending Approval Card */}
          <div
            onClick={handleViewPending}
            className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-yellow-800">Pending</h3>
              <FaClock className="text-2xl text-yellow-300 group-hover:text-yellow-500 transition" />
            </div>
            <p className="text-4xl font-black text-yellow-600">
              {initialPendingCount}
            </p>
            <p className="text-xs text-yellow-400 mt-2 font-medium">
              Review queue &rarr;
            </p>
          </div>

          {/* Tours Card */}
          <div
            onClick={handleViewTours}
            className="bg-purple-50 p-6 rounded-2xl border border-purple-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-purple-800">Tours</h3>
              <FaCalendarCheck className="text-2xl text-purple-300 group-hover:text-purple-500 transition" />
            </div>
            <p className="text-4xl font-black text-purple-600">{toursCount}</p>
            <p className="text-xs text-purple-400 mt-2 font-medium">
              Site tour monitoring &rarr;
            </p>
          </div>
        </div>
      )}

      {activeView === "users" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Admins
                </span>
                <FaUserShield className="text-purple-300" />
              </div>
              <p className="text-2xl font-black text-purple-600">
                {usersList.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                  Owners
                </span>
                <FaUserTie className="text-green-300" />
              </div>
              <p className="text-2xl font-black text-green-600">
                {usersList.filter((u) => u.role === "owner").length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Users
                </span>
                <FaUser className="text-gray-300" />
              </div>
              <p className="text-2xl font-black text-gray-600">
                {usersList.filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              User Directory
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {usersList.length}
              </span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest leading-normal">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Joined</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {usersList.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6 whitespace-nowrap font-semibold text-gray-800">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 text-gray-500">{user.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.role === "admin" ? "bg-purple-100 text-purple-700" : user.role === "owner" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === "properties" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                  Posted
                </span>
                <FaCheck className="text-green-300" />
              </div>
              <p className="text-2xl font-black text-green-600">
                {propertiesList.filter((p) => p.status === "published").length}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Pending
                </span>
                <FaClock className="text-amber-300" />
              </div>
              <p className="text-2xl font-black text-amber-600">
                {propertiesList.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Drafts
                </span>
                <FaBuilding className="text-gray-300" />
              </div>
              <p className="text-2xl font-black text-gray-600">
                {propertiesList.filter((p) => p.status === "draft").length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              All Listings
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {propertiesList.length}
              </span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest leading-normal">
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Owner</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {propertiesList.map((property) => (
                    <tr
                      key={property._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6 whitespace-nowrap font-semibold text-gray-800 truncate max-w-[200px]">
                        {property.title}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {property.owner?.name || "Unknown"}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-700">
                        ${property.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${property.status === "published" ? "bg-green-100 text-green-700" : property.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-right">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeView === "pending" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Pending Approval Review
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {propertiesList.filter((p) => p.status === "pending").length}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {propertiesList
              .filter((p) => p.status === "pending")
              .map((property) => (
                <div
                  key={property._id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-50">
                      <img
                        src={property.images?.[0] || "/placeholder.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        by {property.owner?.name || "Unknown"} • $
                        {property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(property._id)}
                      className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition shadow-sm"
                      title="Approve"
                    >
                      <FaCheck size={14} />
                    </button>
                    <button
                      onClick={() => handleReject(property._id)}
                      className="bg-red-100 text-red-600 p-2.5 rounded-xl hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <FaTimes size={14} />
                    </button>
                    <Link
                      to={`/property/${property._id}`}
                      className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition"
                      title="View Details"
                    >
                      <FaSearch size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            {propertiesList.filter((p) => p.status === "pending").length ===
              0 && (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <FaClock className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400 font-medium">Review queue empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === "tours" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Pending
                </span>
                <FaClock className="text-amber-300" />
              </div>
              <p className="text-2xl font-black text-amber-600">
                {toursList.filter((t) => t.status === "pending").length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                  Accepted
                </span>
                <FaCheck className="text-green-300" />
              </div>
              <p className="text-2xl font-black text-green-600">
                {toursList.filter((t) => t.status === "accepted").length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
                  Rejected
                </span>
                <FaTimes className="text-red-300" />
              </div>
              <p className="text-2xl font-black text-red-600">
                {toursList.filter((t) => t.status === "rejected").length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              Tour Monitoring
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {toursList.length}
              </span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest leading-normal">
                    <th className="py-4 px-6">Property</th>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Owner</th>
                    <th className="py-4 px-6">Date/Time</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {toursList.map((tour) => (
                    <tr
                      key={tour._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6 whitespace-nowrap font-semibold text-gray-800 truncate max-w-[200px]">
                        {tour.property?.title}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {tour.user?.name}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {tour.owner?.name}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs">
                        {tour.date} @ {tour.time}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tour.status === "accepted" ? "bg-green-100 text-green-700" : tour.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {tour.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
