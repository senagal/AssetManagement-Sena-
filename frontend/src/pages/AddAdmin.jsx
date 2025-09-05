import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import UserFormFields from "../forms/UserFormFields";
import Navbar from "../components/Navbar";
import ToastMessage from "../components/ToastMessage";
import { useAuth } from "../context/AuthContext";

export default function AddAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      age: "",
      department: "",
      position: "",
    });
  };

  const handleRegisterAdmin = async (e) => {
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
        "Admin"
      );

      resetForm();
      setToast("New admin registered successfully!");
      setTimeout(() => navigate("/users"), 2000);
    } catch (err) {
      console.error("Admin registration error:", err.response?.data);
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

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user.firstName} />
      <main className="container py-4">
        <h2 className="h5 mb-3">Add New Admin</h2>
        <p className="text-muted mb-4">Register a new admin for the system</p>

        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <form onSubmit={handleRegisterAdmin}>
              {error && <div className="alert alert-danger">{error}</div>}

              <UserFormFields
                form={form}
                setForm={setForm}
                fixedRole="Admin"
                mode="register"
              />

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Registering Admin..." : "Register Admin"}
              </button>
            </form>
          </div>
        </div>

        {toast && (
          <ToastMessage
            message={toast}
            type="success"
            onClose={() => setToast("")}
          />
        )}
      </main>
    </div>
  );
}
