import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import UserFormFields from "../forms/UserFormFields";

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

    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([key, val]) => [key, val.trim?.() ?? val])
    );

    for (const [key, value] of Object.entries(trimmedForm)) {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (key === "age" && Number(value) <= 18)
      ) {
        setError(`You must be older than 18 to register.`);
        setLoading(false);
        return;
      }
    }

    const companyEmailRegex = /^[a-zA-Z0-9._%+-]+@company\.com$/;
    if (!companyEmailRegex.test(trimmedForm.email)) {
      setError("Email must be in the format abc@company.com");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(trimmedForm.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, digit, and symbol"
      );
      setLoading(false);
      return;
    }

    if (trimmedForm.password !== trimmedForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await userService.register(
        trimmedForm.email,
        trimmedForm.password,
        trimmedForm.firstName,
        trimmedForm.lastName,
        Number(trimmedForm.age),
        trimmedForm.department,
        trimmedForm.position,
        "Employee"
      );

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          err.message ||
          "Registration failed"
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
            <h3 className="mb-2">You have been successfully registered!</h3>
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

            <UserFormFields
              form={form}
              setForm={setForm}
              fixedRole="Employee"
              mode="register"
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
