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
    role: "user", // Default role
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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-[var(--color-bg-card)] p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary)]">
          Register
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white text-[var(--color-text-main)]"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white text-[var(--color-text-main)]"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white text-[var(--color-text-main)]"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[var(--color-text-main)] text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] bg-white text-[var(--color-text-main)]"
            >
              <option value="user">Regular User</option>
              <option value="owner">Property Owner</option>
            </select>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              (Note: Admin role cannot be created here)
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color-secondary)] text-white py-2 rounded-lg hover:bg-opacity-90 transition duration-300 font-semibold"
          >
            Submit
          </button>
        </form>
        <p className="mt-4 text-center text-[var(--color-text-muted)] text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-secondary)] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
