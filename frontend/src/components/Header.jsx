import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaUserCircle, FaSignOutAlt, FaBuilding } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="bg-[var(--color-bg-card)] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[var(--color-primary)]"
        >
          <div className="bg-[var(--color-primary)] text-white p-2 rounded-lg">
            <FaBuilding size={20} />
          </div>
          PropVault
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-[var(--color-text-muted)]">
          <Link to="/" className="hover:text-[var(--color-primary)] transition">
            Home
          </Link>
          <Link
            to="/properties"
            className="hover:text-[var(--color-primary)] transition"
          >
            Properties
          </Link>
          {user && (
            <Link
              to="/create-property"
              className="text-[var(--color-primary)] bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
            >
              List Property
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-text-main)] font-medium hidden sm:block">
                Hi, {user.name}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-red-500 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="font-semibold text-[var(--color-text-main)] hover:text-[var(--color-secondary)]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
