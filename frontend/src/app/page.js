"use client";

import { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      const userData = JSON.parse(savedUser);
      setCurrentView(
        userData.role === "admin" ? "admin-dashboard" : "user-dashboard"
      );
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentView(
      userData.role === "admin" ? "admin-dashboard" : "user-dashboard"
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentView("login");
  };

  const renderView = () => {
    switch (currentView) {
      case "register":
        return <Register onSwitchToLogin={() => setCurrentView("login")} />;
      case "user-dashboard":
        return <UserDashboard user={user} onLogout={handleLogout} />;
      case "admin-dashboard":
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
          />
        );
    }
  };

  return <div className="min-h-screen bg-background">{renderView()}</div>;
}
