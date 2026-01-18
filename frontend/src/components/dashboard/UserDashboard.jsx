import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFavorites } from "../../features/auth/authSlice";
import PropertyItem from "../PropertyItem";
import Spinner from "../Spinner";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user, favoritesList, favoritesLoading } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  if (favoritesLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-3xl font-extrabold mb-2 text-[var(--color-primary)]">
          Welcome back, {user && user.name.split(" ")[0]}!
        </h2>
        <p className="text-[var(--color-text-muted)] text-lg">
          Manage your saved properties and tour requests here.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-6 text-[var(--color-text-main)] flex items-center gap-2">
          My Favorites
          <span className="text-sm font-normal text-[var(--color-text-muted)] bg-gray-100 px-3 py-1 rounded-full">
            {favoritesList.length} properties
          </span>
        </h3>

        {favoritesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritesList.map((property) => (
              <PropertyItem key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-gray-400 mb-4 flex justify-center">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-700 mb-2">
              No favorites yet
            </h4>
            <p className="text-gray-500 max-w-sm mx-auto">
              Properties you heart will appear here so you can find them again
              easily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
