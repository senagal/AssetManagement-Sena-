import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container">
        <span className="navbar-brand h4 mb-0">Asset Management</span>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end ${
            !isCollapsed ? "show" : ""
          }`}
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/UserDashboard")}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/assets")}
              >
                Assets
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/requests")}
              >
                Requests
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={() => navigate("/users")}
              >
                User
              </button>
            </li>

            {user?.role === "Admin" && (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link text-danger"
                  onClick={() => navigate("/addAdmin")}
                >
                  + Add Admin
                </button>
              </li>
            )}

            {user && (
              <li className="nav-item">
                <span className="nav-link text-muted small">
                  Welcome, {user.firstName} {user.lastName}
                </span>
              </li>
            )}
            <li className="nav-item">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
