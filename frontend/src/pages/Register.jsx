import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../lib/api";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    age: "",
    department: "",
    position: "",
    role: "Employee",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await apiService.register(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
        Number(form.age),
        form.department,
        form.position,
        form.role
      );
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-4">
        <div
          className="card shadow"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body text-center">
            <div className="text-success display-4 mb-3">✓</div>
            <h3 className="mb-2">Registration Successful!</h3>
            <p className="text-muted">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-4">
      <div
        className="card shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Create Account</h3>
          <p className="text-center text-muted mb-4">
            Register for Asset Management System
          </p>

          <form onSubmit={handleRegister}>
            {error && <div className="alert alert-danger">{error}</div>}

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
            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <InputField
              label="First Name"
              id="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <InputField
              label="Last Name"
              id="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <InputField
              label="Age"
              id="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
            <InputField
              label="Department"
              id="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Enter your department"
              required
            />
            <InputField
              label="Position"
              id="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Enter your position"
              required
            />

            <SelectField
              label="Role"
              id="role"
              value={form.role}
              onChange={handleChange}
              options={[
                { label: "Employee", value: "Employee" },
                { label: "Admin", value: "Admin" },
              ]}
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/")}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .card::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
