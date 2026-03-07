import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const { name, email, password, role } = formData;

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
    const userData = { name, email, password, role };
    dispatch(register(userData));
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
          Create account
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Join PropVault to list or rent properties
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-text-main)" }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Your name"
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

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-text-main)" }}
            >
              I want to
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 transition text-base appearance-none bg-no-repeat bg-[length:1rem] bg-[right_0.75rem_center]"
              style={{
                backgroundColor: "var(--color-bg-input)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            >
              <option value="user">Browse & rent properties</option>
              <option value="owner">List my properties</option>
            </select>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              Admin accounts cannot be created here.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-95 active:scale-[0.99] mt-2"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: "var(--color-secondary)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
