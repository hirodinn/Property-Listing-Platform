import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSystemMetrics,
  getAllUsers,
  getAllProperties,
  getAllTours,
  deleteUser,
  deleteTour,
  disableProperty,
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
  FaArchive,
  FaTrash,
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

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id));
      dispatch(getSystemMetrics());
      dispatch(getAllUsers()); // Refresh user list
    }
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm("Are you sure you want to remove this tour?")) {
      await dispatch(deleteTour(id));
      dispatch(getSystemMetrics());
      dispatch(getAllTours()); // Refresh tours
    }
  };

  const handleDisableProperty = async (id) => {
    // Optimistically toggle? Or wait? Just dispatch.
    await dispatch(disableProperty(id));
    dispatch(getAllProperties()); // Refresh properties to show new status
    dispatch(getSystemMetrics());
  };

  if (isLoading) return <Spinner />;

  // Don't return early on error, show error inside the dashboard layout
  // if (isError) return <div className="text-red-500">Error: {message}</div>;

  return (
    <div
      className="p-6 sm:p-8 rounded-2xl border min-h-[500px]"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Admin Dashboard
        </h2>
        {activeView !== "overview" && (
          <button
            onClick={() => setActiveView("overview")}
            className="flex items-center gap-2 font-semibold hover:opacity-80 transition"
            style={{ color: "var(--color-secondary)" }}
          >
            <FaArrowLeft /> Back to Overview
          </button>
        )}
      </div>

      {isError && (
        <div className="rounded-xl p-4 mb-6 border border-red-300 bg-red-500/10 text-red-700 dark:text-red-300" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {activeView === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="button" onClick={handleViewUsers} className="text-left bg-blue-500/10 dark:bg-blue-500/20 p-6 rounded-2xl border-2 border-transparent hover:border-blue-400/50 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">Users</h3>
              <FaUsers className="text-2xl text-blue-500 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{usersCount}</p>
            <p className="text-xs font-medium mt-2 text-blue-600/80 dark:text-blue-400/80">Manage system roles →</p>
          </button>
          <button type="button" onClick={handleViewProperties} className="text-left bg-orange-500/10 dark:bg-orange-500/20 p-6 rounded-2xl border-2 border-transparent hover:border-orange-400/50 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400">Properties</h3>
              <FaBuilding className="text-2xl text-orange-500 dark:text-orange-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-orange-600 dark:text-orange-400">{propertiesCount}</p>
            <p className="text-xs font-medium mt-2 text-orange-600/80 dark:text-orange-400/80">View all listings →</p>
          </button>
          <button type="button" onClick={handleViewPending} className="text-left bg-amber-500/10 dark:bg-amber-500/20 p-6 rounded-2xl border-2 border-transparent hover:border-amber-400/50 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">Pending</h3>
              <FaClock className="text-2xl text-amber-500 dark:text-amber-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{initialPendingCount}</p>
            <p className="text-xs font-medium mt-2 text-amber-600/80 dark:text-amber-400/80">Review queue →</p>
          </button>
          <button type="button" onClick={handleViewTours} className="text-left bg-violet-500/10 dark:bg-violet-500/20 p-6 rounded-2xl border-2 border-transparent hover:border-violet-400/50 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-violet-700 dark:text-violet-400">Tours</h3>
              <FaCalendarCheck className="text-2xl text-violet-500 dark:text-violet-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-violet-600 dark:text-violet-400">{toursCount}</p>
            <p className="text-xs font-medium mt-2 text-violet-600/80 dark:text-violet-400/80">Site tour monitoring →</p>
          </button>
        </div>
      )}

      {activeView === "users" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-violet-500/10 dark:bg-violet-500/20 p-4 rounded-xl border border-violet-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">Admins</span>
                <FaUserShield className="text-violet-500 dark:text-violet-400" />
              </div>
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{usersList.filter((u) => u.role === "admin").length}</p>
            </div>
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Owners</span>
                <FaUserTie className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{usersList.filter((u) => u.role === "owner").length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Users</span>
                <FaUser style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-2xl font-black" style={{ color: "var(--color-text-main)" }}>{usersList.filter((u) => u.role === "user").length}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
              User Directory
              <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>{usersList.length}</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="uppercase text-[10px] font-bold tracking-widest" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Joined</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user._id} className="border-b transition hover:opacity-90" style={{ borderColor: "var(--color-border)" }}>
                      <td className="py-4 px-6 whitespace-nowrap font-semibold" style={{ color: "var(--color-text-main)" }}>{user.name}</td>
                      <td className="py-4 px-6" style={{ color: "var(--color-text-muted)" }}>{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.role === "admin" ? "bg-violet-500/15 text-violet-600 dark:text-violet-400" : user.role === "owner" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/15 text-slate-600 dark:text-slate-400"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6" style={{ color: "var(--color-text-muted)" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition" title="Delete User"><FaTrash /></button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Posted</span>
                <FaCheck className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{propertiesList.filter((p) => p.status === "published" && !p.deletedAt).length}</p>
            </div>
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Archived</span>
                <FaArchive className="text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{propertiesList.filter((p) => p.status === "archived" && !p.deletedAt).length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Drafts</span>
                <FaBuilding style={{ color: "var(--color-text-muted)" }} />
              </div>
              <p className="text-2xl font-black" style={{ color: "var(--color-text-main)" }}>{propertiesList.filter((p) => p.status === "draft" && !p.deletedAt).length}</p>
            </div>
            <div className="bg-red-500/10 dark:bg-red-500/20 p-4 rounded-xl border border-red-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Deleted</span>
                <FaTrash className="text-red-500 dark:text-red-400" />
              </div>
              <p className="text-2xl font-black text-red-600 dark:text-red-400">{propertiesList.filter((p) => p.deletedAt).length}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
              All Listings
              <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>{propertiesList.length}</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="uppercase text-[10px] font-bold tracking-widest" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Owner</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesList.map((property) => (
                    <tr
                      key={property._id}
                      className={`border-b transition ${property.deletedAt ? "opacity-60" : "cursor-pointer hover:opacity-90"}`}
                      style={{ borderColor: "var(--color-border)" }}
                      onClick={() => !property.deletedAt && window.open(`/property/${property._id}`, "_self")}
                    >
                      <td className="py-4 px-6 whitespace-nowrap font-semibold truncate max-w-[200px]" style={{ color: "var(--color-text-main)" }}>{property.title}</td>
                      <td className="py-4 px-6" style={{ color: "var(--color-text-muted)" }}>{property.owner?.name || "Unknown"}</td>
                      <td className="py-4 px-6 font-medium" style={{ color: "var(--color-text-main)" }}>${property.price.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${property.deletedAt ? "bg-red-500/15 text-red-600 dark:text-red-400" : property.status === "archived" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : property.status === "published" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : property.status === "pending" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-slate-500/15 text-slate-600 dark:text-slate-400"}`}>
                          {property.deletedAt ? "Deleted" : property.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" style={{ color: "var(--color-text-muted)" }}>{new Date(property.createdAt).toLocaleDateString()}</td>
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
          <h3 className="text-xl font-bold flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            Pending Approval Review
            <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {propertiesList.filter((p) => p.status === "pending").length}
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {propertiesList.filter((p) => p.status === "pending").map((property) => (
              <button
                key={property._id}
                type="button"
                onClick={() => window.open(`/property/${property._id}`, "_self")}
                className="w-full text-left rounded-2xl border p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-16 rounded-xl overflow-hidden border shrink-0" style={{ backgroundColor: "var(--color-bg-elevated)", borderColor: "var(--color-border)" }}>
                    <img src={property.images?.[0] || "/placeholder.jpg"} alt={property.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold truncate" style={{ color: "var(--color-text-main)" }}>{property.title}</h4>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>by {property.owner?.name || "Unknown"} • ${property.price.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))}
            {propertiesList.filter((p) => p.status === "pending").length === 0 && (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-main)" }}>
                <FaClock className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: "var(--color-text-muted)" }} />
                <p className="font-medium" style={{ color: "var(--color-text-muted)" }}>Review queue empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === "tours" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-500/10 dark:bg-amber-500/20 p-4 rounded-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending</span>
                <FaClock className="text-amber-500 dark:text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{toursList.filter((t) => t.status === "pending").length}</p>
            </div>
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Accepted</span>
                <FaCheck className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{toursList.filter((t) => t.status === "accepted").length}</p>
            </div>
            <div className="bg-red-500/10 dark:bg-red-500/20 p-4 rounded-xl border border-red-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Rejected</span>
                <FaTimes className="text-red-500 dark:text-red-400" />
              </div>
              <p className="text-2xl font-black text-red-600 dark:text-red-400">{toursList.filter((t) => t.status === "rejected").length}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
              Tour Monitoring
              <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>{toursList.length}</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="uppercase text-[10px] font-bold tracking-widest" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>
                    <th className="py-4 px-6">Property</th>
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Owner</th>
                    <th className="py-4 px-6">Date/Time</th>
                    <th className="py-4 px-6 text-right">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {toursList.map((tour) => (
                    <tr key={tour._id} className="border-b transition hover:opacity-90" style={{ borderColor: "var(--color-border)" }}>
                      <td className="py-4 px-6 whitespace-nowrap font-semibold truncate max-w-[200px]" style={{ color: "var(--color-text-main)" }}>{tour.property?.title}</td>
                      <td className="py-4 px-6" style={{ color: "var(--color-text-muted)" }}>{tour.user?.name}</td>
                      <td className="py-4 px-6" style={{ color: "var(--color-text-muted)" }}>{tour.owner?.name}</td>
                      <td className="py-4 px-6 text-xs" style={{ color: "var(--color-text-muted)" }}>{tour.date} @ {tour.time}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tour.status === "accepted" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : tour.status === "rejected" ? "bg-red-500/15 text-red-600 dark:text-red-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>{tour.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleDeleteTour(tour._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition" title="Remove Tour"><FaTrash /></button>
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
