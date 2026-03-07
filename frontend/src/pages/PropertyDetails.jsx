import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProperty } from "../features/properties/propertySlice";
import Spinner from "../components/Spinner";
import {
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
  FaBookmark,
  FaRegBookmark,
  FaArchive,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  approveProperty,
  rejectProperty,
  deleteProperty,
  archiveProperty,
} from "../features/properties/propertySlice";
import { disableProperty } from "../features/admin/adminSlice";
import { toggleFavorite } from "../features/auth/authSlice";
import { requestTour } from "../features/tours/tourSlice";
import TourRequestModal from "../components/TourRequestModal";

function PropertyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { property, isLoading, isError, message } = useSelector(
    (state) => state.properties,
  );

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    dispatch(getProperty(id));
  }, [dispatch, id, isError, message]);

  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this property?")) {
      try {
        await dispatch(approveProperty(id)).unwrap();
        toast.success("Property approved successfully");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err || "Failed to approve property");
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this property?")) {
      try {
        await dispatch(rejectProperty(id)).unwrap();
        toast.success("Property rejected and moved to drafts");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err || "Failed to reject property");
      }
    }
  };

  const isFavorited = user?.favorites?.includes(id);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    dispatch(toggleFavorite(id));
  };

  const handleDisable = async () => {
    if (
      window.confirm(
        `Are you sure you want to ${user.role === "admin" ? "disable" : "archive"} this property?`,
      )
    ) {
      try {
        if (user.role === "admin") {
          await dispatch(disableProperty(id)).unwrap();
          toast.success("Property disabled successfully");
        } else {
          await dispatch(archiveProperty(id)).unwrap();
          toast.success("Property archived successfully");
        }
        dispatch(getProperty(id));
      } catch (err) {
        toast.error(err || "Failed to update property status");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      try {
        await dispatch(deleteProperty(id)).unwrap();
        toast.success("Draft deleted successfully");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err || "Failed to delete draft");
      }
    }
  };

  const handleTourSubmit = async (tourData) => {
    try {
      await dispatch(
        requestTour({
          propertyId: id,
          ...tourData,
        }),
      ).unwrap();
      toast.success("Tour request sent successfully!");
    } catch (err) {
      toast.error(err || "Failed to send tour request");
    }
  };

  if (isLoading || !property) {
    return <Spinner />;
  }

  const statusStyles = {
    published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    draft: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
    archived: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  };
  const statusClass = statusStyles[property.status] || statusStyles.draft;

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition"
        style={{ color: "var(--color-secondary)" }}
      >
        ← Back to Properties
      </button>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="p-6 sm:p-8 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight" style={{ color: "var(--color-primary)" }}>
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-lg" style={{ color: "var(--color-text-muted)" }}>
                <FaMapMarkerAlt style={{ color: "var(--color-secondary)" }} />
                {property.location}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="text-3xl font-bold" style={{ color: "var(--color-secondary)" }}>
                ${property.price.toLocaleString()}
                <span className="text-base font-normal ml-1" style={{ color: "var(--color-text-muted)" }}>/mo</span>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${statusClass}`}>
                {property.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8" style={{ backgroundColor: "var(--color-bg-main)" }}>
          {property.images && property.images.length > 0 ? (
            <div
              className={`grid gap-4 ${
                property.images.length === 1
                  ? "grid-cols-1 max-w-4xl mx-auto"
                  : property.images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    property.images.length === 1
                      ? "h-[400px] sm:h-[500px]"
                      : index === 0 && property.images.length > 2
                        ? "md:col-span-2 md:row-span-2 h-[300px] md:h-[400px]"
                        : property.images.length === 2
                          ? "h-[300px]"
                          : "h-[220px]"
                  }`}
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <img
                    src={img}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="h-64 flex items-center justify-center rounded-xl text-lg font-medium"
              style={{ backgroundColor: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
            >
              No Images Available
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                Description
              </h3>
              <p className="leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-main)" }}>
                {property.description}
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border h-fit"
              style={{
                backgroundColor: "var(--color-bg-main)",
                borderColor: "var(--color-border)",
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                Contact Agent
              </h3>
              {property.owner ? (
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    {property.owner.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate" style={{ color: "var(--color-text-main)" }}>
                      {property.owner.name}
                    </p>
                    <p className="text-sm truncate" style={{ color: "var(--color-text-muted)" }}>
                      {property.owner.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mb-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Owner information not available.
                </p>
              )}

              {user && (user.role === "admin" || user.role === "owner") ? (
                <div className="space-y-3">
                  {user.role === "admin" && property.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleApprove}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={handleReject}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}

                  {property.status === "published" && (
                    <button
                      onClick={handleDisable}
                      className="w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25"
                    >
                      <FaArchive />{" "}
                      {user.role === "admin" ? "Disable Property" : "Archive Property"}
                    </button>
                  )}

                  {property.status === "draft" && (
                    <button
                      onClick={handleDelete}
                      className="w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25"
                    >
                      <FaTrash /> Delete Property
                    </button>
                  )}

                  <p className="text-center text-xs italic" style={{ color: "var(--color-text-muted)" }}>
                    Managing as {user.role}
                  </p>
                </div>
              ) : (
                user?.role === "user" && (
                  <button
                    onClick={() => setIsTourModalOpen(true)}
                    className="w-full py-3 rounded-xl font-bold transition hover:opacity-95 active:scale-[0.99]"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Request a Tour
                  </button>
                )
              )}

              {user?.role === "user" && (
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full mt-3 py-3 rounded-xl font-bold border-2 transition flex items-center justify-center gap-2 ${
                    isFavorited
                      ? "border-amber-500 text-amber-500 dark:text-amber-400 bg-amber-500/10"
                      : "hover:opacity-90"
                  }`}
                  style={{
                    borderColor: isFavorited ? undefined : "var(--color-border)",
                    color: isFavorited ? undefined : "var(--color-text-main)",
                  }}
                >
                  {isFavorited ? (
                    <>
                      <FaBookmark /> Saved to Favorites
                    </>
                  ) : (
                    <>
                      <FaRegBookmark /> Save to Favorites
                    </>
                  )}
                </button>
              )}

              <p className="text-center text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
                Posted on {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TourRequestModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onSubmit={handleTourSubmit}
        propertyTitle={property.title}
      />
    </div>
  );
}

export default PropertyDetails;
