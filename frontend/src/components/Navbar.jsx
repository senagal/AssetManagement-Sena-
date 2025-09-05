import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">Asset Management</h1>
        <nav className="d-flex align-items-center gap-3">
          <button
            className="btn btn-link"
            onClick={() => navigate("/UserDashboard")}
          >
            Dashboard
          </button>
          <button className="btn btn-link" onClick={() => navigate("/assets")}>
            Assets
          </button>
          <button
            className="btn btn-link"
            onClick={() => navigate("/requests")}
          >
            Requests
          </button>
          {user && (
            <span className="text-muted small">
              Welcome, {user.firstName} {user.lastName}
            </span>
          )}

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
