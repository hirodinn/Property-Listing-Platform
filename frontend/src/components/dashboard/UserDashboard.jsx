import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Welcome, {user && user.name}
      </h2>
      <p className="text-[var(--color-text-muted)]">
        This is your personal dashboard.
      </p>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Favorites</h3>
        <p className="text-gray-500 italic">
          No favorite properties saved yet.
        </p>
        {/* List favorites here later */}
      </div>
    </div>
  );
};

export default UserDashboard;
