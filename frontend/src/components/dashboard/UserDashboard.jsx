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
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
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

  const [activeView, setActiveView] = useState("overview"); // overview, favorites, tours

  useEffect(() => {
    dispatch(getFavorites());
    dispatch(getUserTours());

    return () => {
      dispatch(resetTours());
    };
  }, [dispatch]);

  if (favoritesLoading || toursLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-(--color-primary)">
            User Dashboard
          </h2>
          <p className="text-(--color-text-muted)">
            Welcome back, {user && user.name.split(" ")[0]}!
          </p>
        </div>
        {activeView !== "overview" && (
          <button
            onClick={() => setActiveView("overview")}
            className="flex items-center gap-2 text-gray-600 hover:text-(--color-primary) font-medium transition"
          >
            <FaArrowLeft /> Back to Overview
          </button>
        )}
      </div>

      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Favorites Card */}
          <div
            onClick={() => setActiveView("favorites")}
            className="bg-amber-50 p-8 rounded-2xl border border-amber-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-amber-800">My Favorites</h3>
              <FaBookmark className="text-3xl text-amber-300 group-hover:text-amber-500 transition" />
            </div>
            <p className="text-5xl font-black text-amber-600">
              {favoritesList.length}
            </p>
            <p className="text-sm text-amber-400 mt-4 font-medium">
              Saved properties &rarr;
            </p>
          </div>

          {/* Tours Card */}
          <div
            onClick={() => setActiveView("tours")}
            className="bg-blue-50 p-8 rounded-2xl border border-blue-100 cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-800">Tour Requests</h3>
              <FaCalendarCheck className="text-3xl text-blue-300 group-hover:text-blue-500 transition" />
            </div>
            <p className="text-5xl font-black text-blue-600">{tours.length}</p>
            <p className="text-sm text-blue-400 mt-4 font-medium">
              Scheduled visits &rarr;
            </p>
          </div>
        </div>
      )}

      {activeView === "favorites" && (
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            My Favorites
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {favoritesList.length} total
            </span>
          </h3>
          {favoritesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoritesList.map((property) => (
                <PropertyItem key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
              <FaBookmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-700">
                No favorites yet
              </h4>
              <p className="text-gray-500 mt-2">
                Discover and save properties you love!
              </p>
            </div>
          )}
        </div>
      )}

      {activeView === "tours" && (
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            My Tour Requests
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {tours.length} requests
            </span>
          </h3>
          {tours.length > 0 ? (
            <div className="space-y-6">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition"
                >
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img
                      src={tour.property?.images?.[0] || "/placeholder.jpg"}
                      alt={tour.property?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-gray-800">
                        {tour.property?.title}
                      </h4>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <p className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-gray-400" />{" "}
                        {tour.property?.location}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400" /> {tour.date}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" /> {tour.time}
                      </p>
                    </div>
                    {tour.message && (
                      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                        "{tour.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex md:flex-col justify-end gap-3 text-right">
                    <p className="text-xs text-gray-400">
                      Owner:{" "}
                      <span className="font-bold">{tour.owner?.name}</span>
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:${tour.owner?.email}`)
                      }
                      className="text-sm font-bold text-(--color-primary) hover:underline"
                    >
                      Contact Owner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
              <FaCalendarCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-700">
                No tours scheduled
              </h4>
              <p className="text-gray-500 mt-2">
                Request a tour on any property details page!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
