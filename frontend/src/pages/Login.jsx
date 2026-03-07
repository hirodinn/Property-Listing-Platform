import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div
        className="w-full max-w-md p-8 sm:p-10 rounded-2xl border shadow-lg"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--color-primary)" }}>
          Welcome back
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Sign in to your account
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-text-main)" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition text-base"
              style={{
                backgroundColor: "var(--color-bg-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-text-main)" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="••••••••"
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition text-base"
              style={{
                backgroundColor: "var(--color-bg-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-95 active:scale-[0.99]"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold hover:underline"
            style={{ color: "var(--color-secondary)" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
