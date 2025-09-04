import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../lib/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
