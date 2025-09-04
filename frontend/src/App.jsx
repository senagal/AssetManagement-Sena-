import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AssetsPage from "./pages/AssetsPage";
import RequestsPage from "./pages/RequestsPage";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
