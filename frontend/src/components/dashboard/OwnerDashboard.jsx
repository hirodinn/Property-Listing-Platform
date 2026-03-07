import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyProperties,
  archiveProperty,
  deleteProperty,
  publishProperty,
  reset as propertiesReset,
} from "../../features/properties/propertySlice";
import {
  getOwnerTours,
  updateTourStatus,
  reset as toursReset,
} from "../../features/tours/tourSlice";
import Spinner from "../Spinner";
import {
  FaPlus,
  FaTrash,
  FaPen,
  FaEye,
  FaUpload,
  FaClock,
  FaBuilding,
  FaCalendarCheck,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelope,
  FaArchive,
} from "react-icons/fa";
import CreatePropertyForm from "./CreatePropertyForm";

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const {
    properties,
    isLoading: propertiesLoading,
    isError,
    message,
  } = useSelector((state) => state.properties);
  const { tours: tourRequests, isLoading: toursLoading } = useSelector(
    (state) => state.tours,
  );

  const tours = Array.isArray(tourRequests) ? tourRequests : [];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    dispatch(getMyProperties());
    dispatch(getOwnerTours());
    return () => {
      dispatch(propertiesReset());
      dispatch(toursReset());
    };
  }, [dispatch]);

  const handleArchive = (id) => {
    if (window.confirm("Are you sure you want to archive this property?")) {
      dispatch(archiveProperty(id));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(deleteProperty(id));
    }
  };

  const handlePublish = (id) => {
    if (window.confirm("Are you ready to publish this property? It will be visible to everyone.")) {
      dispatch(publishProperty(id));
    }
  };

  const handleCreateSuccess = useCallback(() => {
    setShowCreateForm(false);
    setEditProperty(null);
  }, []);

  const handleUpdateTourStatus = (tourId, status) => {
    if (window.confirm(`Are you sure you want to ${status} this tour request?`)) {
      dispatch(updateTourStatus({ tourId, status }));
    }
  };

  if (propertiesLoading || toursLoading) {
    return <Spinner />;
  }

  const drafts = properties.filter((p) => p.status === "draft");
  const pending = properties.filter((p) => p.status === "pending");
  const published = properties.filter((p) => p.status === "published");
  const archived = properties.filter((p) => p.status === "archived");

  const StatCard = ({ onClick, title, count, sub, icon: Icon, colors }) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-6 rounded-2xl border-2 border-transparent hover:shadow-lg transition group ${colors}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <Icon className="text-2xl opacity-80 group-hover:scale-110 transition" />
      </div>
      <p className="text-3xl font-black">{count}</p>
      <p className="text-xs font-medium mt-2 opacity-80">{sub}</p>
    </button>
  );

  const PropertyCard = ({ property }) => (
    <div
      className="rounded-xl border p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}
    >
      <div className="flex gap-4 items-center min-w-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[var(--color-bg-elevated)]">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--color-text-muted)" }}>No Image</div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold truncate" style={{ color: "var(--color-primary)" }}>{property.title}</h4>
          <p className="text-sm truncate" style={{ color: "var(--color-secondary)" }}>{property.location}</p>
          <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-text-main)" }}>${property.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Link
          to={`/property/${property._id}`}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25"
        >
          <FaEye /> View
        </Link>
        {property.status === "draft" && (
          <>
            <button
              onClick={() => { setEditProperty(property); setShowCreateForm(true); setActiveView("drafts"); }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
            >
              <FaPen /> Edit
            </button>
            <button
              onClick={() => handlePublish(property._id)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
            >
              <FaUpload /> Publish
            </button>
            <button
              onClick={() => handleDelete(property._id)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25"
            >
              <FaTrash /> Delete
            </button>
          </>
        )}
        {property.status === "published" && (
          <button
            onClick={() => handleArchive(property._id)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25"
          >
            <FaArchive /> Archive
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl border min-h-[600px] p-6 sm:p-8"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-primary)" }}>
            Owner Dashboard
          </h2>
          {activeView === "overview" && (
            <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
              Welcome to your property management hub.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {activeView !== "overview" && (
            <button
              onClick={() => { setActiveView("overview"); setShowCreateForm(false); setEditProperty(null); }}
              className="flex items-center gap-2 font-semibold hover:opacity-80 transition"
              style={{ color: "var(--color-secondary)" }}
            >
              <FaArrowLeft /> Back to Overview
            </button>
          )}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <FaPlus /> List New Property
            </button>
          )}
        </div>
      </div>

      {isError && (
        <div className="rounded-xl p-4 mb-6 border border-red-300 bg-red-500/10 text-red-700 dark:text-red-300">
          {message}
        </div>
      )}

      {activeView === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard onClick={() => setActiveView("drafts")} title="My Drafts" count={drafts.length} sub="Finish listing →" icon={FaPen} colors="bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 hover:border-slate-400/50" />
          <StatCard onClick={() => setActiveView("pending")} title="Pending" count={pending.length} sub="Awaiting review →" icon={FaClock} colors="bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 hover:border-amber-400/50" />
          <StatCard onClick={() => setActiveView("posted")} title="Posted" count={published.length} sub="Live listings →" icon={FaBuilding} colors="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:border-emerald-400/50" />
          <StatCard onClick={() => setActiveView("archived")} title="Archived" count={archived.length} sub="Archived listings →" icon={FaArchive} colors="bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:border-blue-400/50" />
          <StatCard onClick={() => setActiveView("tours")} title="Tours" count={tours.filter((t) => t.status === "pending").length} sub="Tour requests →" icon={FaCalendarCheck} colors="bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 hover:border-violet-400/50" />
        </div>
      )}

      {showCreateForm && (
        <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}>
          <CreatePropertyForm
            key={editProperty ? editProperty._id : "create-form"}
            onSuccess={handleCreateSuccess}
            onCancel={() => { setShowCreateForm(false); setEditProperty(null); }}
            initialData={editProperty}
          />
        </div>
      )}

      {activeView === "drafts" && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            My Drafts
            <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>{drafts.length}</span>
          </h3>
          <div className="space-y-4">
            {drafts.map((p) => <PropertyCard key={p._id} property={p} />)}
            {drafts.length === 0 && (
              <p className="rounded-xl border border-dashed p-8 text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No drafts found.</p>
            )}
          </div>
        </div>
      )}

      {activeView === "pending" && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            Pending Approval
            <span className="text-sm font-normal px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">{pending.length}</span>
          </h3>
          <div className="space-y-4">
            {pending.map((p) => <PropertyCard key={p._id} property={p} />)}
            {pending.length === 0 && (
              <p className="rounded-xl border border-dashed p-8 text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No pending properties.</p>
            )}
          </div>
        </div>
      )}

      {activeView === "posted" && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            Posted Properties
            <span className="text-sm font-normal px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">{published.length}</span>
          </h3>
          <div className="space-y-4">
            {published.map((p) => <PropertyCard key={p._id} property={p} />)}
            {published.length === 0 && (
              <p className="rounded-xl border border-dashed p-8 text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No posted properties yet.</p>
            )}
          </div>
        </div>
      )}

      {activeView === "archived" && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            Archived Properties
            <span className="text-sm font-normal px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400">{archived.length}</span>
          </h3>
          <div className="space-y-4">
            {archived.map((p) => <PropertyCard key={p._id} property={p} />)}
            {archived.length === 0 && (
              <p className="rounded-xl border border-dashed p-8 text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>No archived properties.</p>
            )}
          </div>
        </div>
      )}

      {activeView === "tours" && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            Incoming Tour Requests
            <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>{tours.length} total</span>
          </h3>
          {tours.length > 0 ? (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="rounded-2xl border p-4 sm:p-6 flex flex-col md:flex-row gap-4"
                  style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}
                >
                  <div className="w-full md:w-28 h-20 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: "var(--color-border)" }}>
                    <img src={tour.property?.images?.[0] || "/placeholder.jpg"} alt={tour.property?.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold" style={{ color: "var(--color-text-main)" }}>{tour.property?.title}</h4>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--color-text-muted)" }}><FaMapMarkerAlt /> {tour.property?.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${tour.status === "accepted" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : tour.status === "rejected" ? "bg-red-500/15 text-red-600 dark:text-red-400" : "bg-blue-500/15 text-blue-600 dark:text-blue-400"}`}>{tour.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
                      <span className="flex items-center gap-1.5 bg-[var(--color-bg-card)] px-2 py-1 rounded text-xs font-medium"><FaCalendarCheck /> {tour.date}</span>
                      <span className="flex items-center gap-1.5 bg-[var(--color-bg-card)] px-2 py-1 rounded text-xs font-medium"><FaClock /> {tour.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs pt-3 mt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white bg-[var(--color-secondary)]">{tour.user?.name?.charAt(0) || "?"}</div>
                      <span className="font-medium" style={{ color: "var(--color-text-main)" }}>{tour.user?.name || "Anonymous User"}</span>
                      <a href={`mailto:${tour.user?.email}`} className="hover:opacity-80" style={{ color: "var(--color-text-muted)" }}><FaEnvelope /></a>
                    </div>
                    {tour.message && (
                      <p className="mt-3 text-xs italic p-2 rounded" style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text-muted)" }}>&quot;{tour.message}&quot;</p>
                    )}
                  </div>
                  {tour.status === "pending" && (
                    <div className="flex md:flex-col gap-2 justify-center border-l pl-6" style={{ borderColor: "var(--color-border)" }}>
                      <button onClick={() => handleUpdateTourStatus(tour._id, "accepted")} className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition"><FaCheck /> Accept</button>
                      <button onClick={() => handleUpdateTourStatus(tour._id, "rejected")} className="flex items-center justify-center gap-2 bg-red-500/15 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/25 transition"><FaTimes /> Decline</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed p-12 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-main)" }}>
              <FaCalendarCheck className="w-14 h-14 mx-auto mb-4 opacity-40" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-muted)" }}>No tour requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
