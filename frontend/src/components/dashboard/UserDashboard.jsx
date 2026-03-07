import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFavorites } from "../../features/auth/authSlice";
import {
  getUserTours,
  reset as resetTours,
} from "../../features/tours/tourSlice";
import PropertyItem from "../PropertyItem";
import Spinner from "../Spinner";
import {
  FaBookmark,
  FaCalendarCheck,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user, favoritesList, favoritesLoading } = useSelector(
    (state) => state.auth,
  );
  const { tours: tourRequests, isLoading: toursLoading } = useSelector(
    (state) => state.tours,
  );

  const tours = Array.isArray(tourRequests) ? tourRequests : [];
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    dispatch(getFavorites());
    dispatch(getUserTours());
    return () => dispatch(resetTours());
  }, [dispatch]);

  if (favoritesLoading || toursLoading) {
    return <Spinner />;
  }

  return (
    <div
      className="max-w-6xl mx-auto rounded-2xl border min-h-[600px] p-6 sm:p-8"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-primary)" }}>
            User Dashboard
          </h2>
          <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
            Welcome back, {user?.name?.split(" ")[0]}!
          </p>
        </div>
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

      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setActiveView("favorites")}
            className="text-left p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-amber-400/50 bg-amber-500/10 dark:bg-amber-500/20 transition hover:shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400">My Favorites</h3>
              <FaBookmark className="text-3xl text-amber-500 dark:text-amber-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{favoritesList.length}</p>
            <p className="text-sm font-medium mt-2 text-amber-600/80 dark:text-amber-400/80">Saved properties →</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("tours")}
            className="text-left p-6 sm:p-8 rounded-2xl border-2 border-transparent hover:border-blue-400/50 bg-blue-500/10 dark:bg-blue-500/20 transition hover:shadow-lg group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">Tour Requests</h3>
              <FaCalendarCheck className="text-3xl text-blue-500 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{tours.length}</p>
            <p className="text-sm font-medium mt-2 text-blue-600/80 dark:text-blue-400/80">Scheduled visits →</p>
          </button>
        </div>
      )}

      {activeView === "favorites" && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            My Favorites
            <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>
              {favoritesList.length} total
            </span>
          </h3>
          {favoritesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesList.map((property) => (
                <PropertyItem key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-main)" }}>
              <FaBookmark className="w-14 h-14 mx-auto mb-4 opacity-40" style={{ color: "var(--color-text-muted)" }} />
              <h4 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>No favorites yet</h4>
              <p style={{ color: "var(--color-text-muted)" }}>Discover and save properties you love!</p>
            </div>
          )}
        </div>
      )}

      {activeView === "tours" && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-text-main)" }}>
            My Tour Requests
            <span className="text-sm font-normal px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-bg-main)", color: "var(--color-text-muted)" }}>
              {tours.length} requests
            </span>
          </h3>
          {tours.length > 0 ? (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="rounded-2xl border p-4 sm:p-6 flex flex-col md:flex-row gap-4 hover:shadow-md transition"
                  style={{ backgroundColor: "var(--color-bg-main)", borderColor: "var(--color-border)" }}
                >
                  <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--color-border)" }}>
                    <img
                      src={tour.property?.images?.[0] || "/placeholder.jpg"}
                      alt={tour.property?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <h4 className="font-bold text-lg" style={{ color: "var(--color-text-main)" }}>{tour.property?.title}</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          tour.status === "accepted"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : tour.status === "rejected"
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {tour.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
                      <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {tour.property?.location}</span>
                      <span className="flex items-center gap-1.5"><FaCalendarAlt /> {tour.date}</span>
                      <span className="flex items-center gap-1.5"><FaClock /> {tour.time}</span>
                    </div>
                    {tour.message && (
                      <p className="text-sm p-3 rounded-xl border mt-2 italic" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                        &quot;{tour.message}&quot;
                      </p>
                    )}
                  </div>
                  <div className="flex md:flex-col justify-end gap-2 text-right shrink-0">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      Owner: <span className="font-bold" style={{ color: "var(--color-text-main)" }}>{tour.owner?.name}</span>
                    </p>
                    <a
                      href={`mailto:${tour.owner?.email}`}
                      className="text-sm font-bold hover:underline"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Contact Owner
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-main)" }}>
              <FaCalendarCheck className="w-14 h-14 mx-auto mb-4 opacity-40" style={{ color: "var(--color-text-muted)" }} />
              <h4 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-main)" }}>No tours scheduled</h4>
              <p style={{ color: "var(--color-text-muted)" }}>Request a tour on any property details page!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
