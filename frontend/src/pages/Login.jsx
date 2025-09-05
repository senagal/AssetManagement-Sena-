import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
    } catch (err) {
      const status = err.status;
      const message = err.message;

      if (status === 404) {
        setError("Invalid credentials. Please try again.");
      } else if (status === 401) {
        setError("Invalid credentials. Please try again.");
      } else if (status === 400) {
        setError("Email and password are required.");
      } else {
        setError(
          typeof message === "string"
            ? message
            : "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-4">
      <div className="card shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-3">
            Asset Management System
          </h3>
          <p className="text-center text-muted mb-4">Sign in to your account</p>

          <form onSubmit={handleLogin}>
            {error && (
              <p
                className="text-danger text-center mb-3"
                style={{ fontSize: "0.95rem" }}
              >
                {error}
              </p>
            )}

            <InputField
              label="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </button>
          </div>

          <div className="mt-3 p-2 bg-light border rounded">
            <p className="mb-1">
              <strong>Demo Accounts:</strong>
            </p>
            <p className="mb-0">Admin: admin@company.com / Admin@123</p>
            <p>User: employee@company.com / Employee@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
