import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaUserCircle, FaSignOutAlt, FaBuilding } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-200"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center max-w-7xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold transition-opacity hover:opacity-90"
          style={{ color: "var(--color-primary)" }}
        >
          <div
            className="p-2 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-light)",
            }}
          >
            <FaBuilding size={20} />
          </div>
          <span className="tracking-tight">PropVault</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-colors hover:opacity-80"
            style={{
              color: "var(--color-text-main)",
              backgroundColor: "var(--color-bg-main)",
            }}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <MdLightMode size={20} />
            ) : (
              <MdDarkMode size={20} />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-colors hover:opacity-90"
                style={{ color: "var(--color-text-main)" }}
              >
                <FaUserCircle className="text-lg sm:text-base shrink-0" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <FaSignOutAlt className="text-lg sm:text-base shrink-0" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="font-semibold px-4 py-2 rounded-xl transition-colors hover:opacity-90"
                style={{ color: "var(--color-text-main)" }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-95 active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-light)",
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
