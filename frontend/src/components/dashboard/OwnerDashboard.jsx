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
  const [activeView, setActiveView] = useState("overview"); // overview, drafts, pending, posted, tours

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
    if (
      window.confirm(
        "Are you ready to publish this property? It will be visible to everyone.",
      )
    ) {
      dispatch(publishProperty(id));
    }
  };

  const handleCreateSuccess = useCallback(() => {
    setShowCreateForm(false);
    setEditProperty(null);
    // The propertySlice should already handle adding the new property to the state,
    // but if not, we might need to re-fetch or rely on the store update.
    // Based on slice logic: state.properties.push(action.payload) is there.
  }, []);

  const handleUpdateTourStatus = (tourId, status) => {
    if (
      window.confirm(`Are you sure you want to ${status} this tour request?`)
    ) {
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

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg text-(--color-primary)">
            {property.title}
          </h4>
          <p className="text-sm text-(--color-secondary)">
            {property.location}
          </p>
          <p className="text-sm font-semibold mt-1">
            ${property.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
        <Link
          to={`/property/${property._id}`}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm"
        >
          <FaEye /> View
        </Link>

        {property.status === "draft" && (
          <>
            <button
              onClick={() => {
                setEditProperty(property);
                setShowCreateForm(true);
                setActiveView("drafts");
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 font-medium text-sm"
            >
              <FaPen /> Edit
            </button>
            <button
              onClick={() => handlePublish(property._id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium text-sm"
            >
              <FaUpload /> Publish
            </button>
            <button
              onClick={() => handleDelete(property._id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
            >
              <FaTrash /> Delete
            </button>
          </>
        )}

        {property.status === "published" && (
          <button
            onClick={() => handleArchive(property._id)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm"
          >
            <FaArchive /> Archive
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-(--color-primary)">
            Owner Dashboard
          </h2>
          {activeView === "overview" && (
            <p className="text-(--color-text-muted)">
              Welcome to your property management hub.
            </p>
          )}
        </div>
        <div className="flex gap-4">
          {activeView !== "overview" && (
            <button
              onClick={() => {
                setActiveView("overview");
                setShowCreateForm(false);
                setEditProperty(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-(--color-primary) font-medium transition"
            >
              <FaArrowLeft /> Back to Overview
            </button>
          )}
          {!showCreateForm && (
            <button
              onClick={() => {
                setActiveView("drafts"); // Default to drafts when creating? Or maybe just keep it simple.
                setShowCreateForm(true);
              }}
              className="flex items-center gap-2 bg-(--color-primary) text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition font-medium shadow-md text-sm"
            >
              <FaPlus /> List New Property
            </button>
          )}
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">
          {message}
        </div>
      )}

      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Drafts Card */}
          <div
            onClick={() => setActiveView("drafts")}
            className="bg-gray-50 p-6 rounded-2xl border border-gray-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-800">My Drafts</h3>
              <FaPen className="text-2xl text-gray-300 group-hover:text-gray-500 transition" />
            </div>
            <p className="text-4xl font-black text-gray-600">{drafts.length}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Finish listing &rarr;
            </p>
          </div>

          {/* Pending Card */}
          <div
            onClick={() => setActiveView("pending")}
            className="bg-amber-50 p-6 rounded-2xl border border-amber-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-amber-800">Pending</h3>
              <FaClock className="text-2xl text-amber-300 group-hover:text-amber-500 transition" />
            </div>
            <p className="text-4xl font-black text-amber-600">
              {pending.length}
            </p>
            <p className="text-xs text-amber-400 mt-2 font-medium">
              Awaiting review &rarr;
            </p>
          </div>

          {/* Posted Card */}
          <div
            onClick={() => setActiveView("posted")}
            className="bg-green-50 p-6 rounded-2xl border border-green-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-green-800">Posted</h3>
              <FaBuilding className="text-2xl text-green-300 group-hover:text-green-500 transition" />
            </div>
            <p className="text-4xl font-black text-green-600">
              {published.length}
            </p>
            <p className="text-xs text-green-400 mt-2 font-medium">
              Live listings &rarr;
            </p>
          </div>

          {/* Archived Card */}
          <div
            onClick={() => setActiveView("archived")}
            className="bg-blue-50 p-6 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-blue-800">Archived</h3>
              <FaArchive className="text-2xl text-blue-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-4xl font-black text-blue-600">
              {archived.length}
            </p>
            <p className="text-xs text-blue-400 mt-2 font-medium">
              Archived listings &rarr;
            </p>
          </div>

          {/* Tours Card */}
          <div
            onClick={() => setActiveView("tours")}
            className="bg-purple-50 p-6 rounded-2xl border border-purple-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-purple-800">Tours</h3>
              <FaCalendarCheck className="text-2xl text-purple-300 group-hover:text-purple-500 transition" />
            </div>
            <p className="text-4xl font-black text-purple-600">
              {tours.filter((t) => t.status === "pending").length}
            </p>
            <p className="text-xs text-purple-400 mt-2 font-medium">
              Tour requests &rarr;
            </p>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          <CreatePropertyForm
            key={editProperty ? editProperty._id : "create-form"}
            onSuccess={handleCreateSuccess}
            onCancel={() => {
              setShowCreateForm(false);
              setEditProperty(null);
            }}
            initialData={editProperty}
          />
        </div>
      )}

      {activeView === "drafts" && (
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            My Drafts
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {drafts.length}
            </span>
          </h3>
          <div className="space-y-4">
            {drafts.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
            {drafts.length === 0 && (
              <p className="text-gray-400 bg-gray-50 p-8 rounded-xl border border-dashed text-center">
                No drafts found.
              </p>
            )}
          </div>
        </div>
      )}

      {activeView === "pending" && (
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Pending Approval
            <span className="text-sm font-normal text-amber-400 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              {pending.length}
            </span>
          </h3>
          <div className="space-y-4">
            {pending.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
            {pending.length === 0 && (
              <p className="text-gray-400 bg-gray-50 p-8 rounded-xl border border-dashed text-center">
                No pending properties.
              </p>
            )}
          </div>
        </div>
      )}

      {activeView === "posted" && (
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Posted Properties
            <span className="text-sm font-normal text-green-400 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              {published.length}
            </span>
          </h3>
          <div className="space-y-4">
            {published.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
            {published.length === 0 && (
              <p className="text-gray-400 bg-gray-50 p-8 rounded-xl border border-dashed text-center">
                No posted properties yet.
              </p>
            )}
          </div>
        </div>
      )}

      {activeView === "archived" && (
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Archived Properties
            <span className="text-sm font-normal text-blue-400 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {archived.length}
            </span>
          </h3>
          <div className="space-y-4">
            {archived.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
            {archived.length === 0 && (
              <p className="text-gray-400 bg-gray-50 p-8 rounded-xl border border-dashed text-center">
                No archived properties.
              </p>
            )}
          </div>
        </div>
      )}

      {activeView === "tours" && (
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            Incoming Tour Requests
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {tours.length} total
            </span>
          </h3>
          {tours.length > 0 ? (
            <div className="space-y-6">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition group"
                >
                  <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <img
                      src={tour.property?.images?.[0] || "/placeholder.jpg"}
                      alt={tour.property?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {tour.property?.title}
                        </h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FaMapMarkerAlt /> {tour.property?.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tour.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : tour.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tour.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-2">
                      <p className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
                        <FaCalendarCheck className="text-blue-400" />{" "}
                        {tour.date}
                      </p>
                      <p className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
                        <FaClock className="text-blue-400" /> {tour.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs border-t border-gray-50 pt-3 mt-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {tour.user?.name?.charAt(0) || "?"}
                      </div>
                      <p className="font-medium text-gray-700">
                        {tour.user?.name || "Anonymous User"}
                      </p>
                      <a
                        href={`mailto:${tour.user?.email}`}
                        className="text-gray-400 hover:text-(--color-primary) transition"
                      >
                        <FaEnvelope />
                      </a>
                    </div>
                    {tour.message && (
                      <p className="mt-3 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                        "{tour.message}"
                      </p>
                    )}
                  </div>
                  {tour.status === "pending" && (
                    <div className="flex md:flex-col gap-2 justify-center border-l border-gray-50 pl-6">
                      <button
                        onClick={() =>
                          handleUpdateTourStatus(tour._id, "accepted")
                        }
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateTourStatus(tour._id, "rejected")
                        }
                        className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition"
                      >
                        <FaTimes /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center text-gray-400">
              <FaCalendarCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No tour requests yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
