import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { logout } from "./services/auth";
import "./components/Student.css";

// Pages
import UserRegister from "./auth/UserRegister";
import AdminPanel from "./panels/AdminPanel";
import UserPanel from "./panels/UserPanel";
import AdminLogin from "./auth/AdminLogin";
import UserLogin from "./auth/UserLogin";

import ProtectedRoute from "./components/ProtectedRoute";

function Landing() {
  return (
    <div className="login-container">
      <h2>Select Login</h2>

      <div style={{ marginTop: "20px" }}>
        <a href="/user/login">
          <button className="btn-save" style={{ marginRight: "10px" }}>
            User Login
          </button>
        </a>

        <a href="/admin/login">
          <button className="btn-delete">
            Admin Login
          </button>
        </a>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  // 🌙 Theme
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // UI state
  const [refresh, setRefresh] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState("");

  // 🌙 Theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const reloadStudents = () => setRefresh(!refresh);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const logoutUser = () => {
  logout();
  navigate("/user/login", { replace: true });
};

  return (
    <>
      {/* 🌙 Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* 🔔 Toast */}
      {toast && <div className="toast">{toast}</div>}

      <Routes>
        {/* Default */}
        <Route path="/" element={<Landing />} />


        {/* LOGIN */}
        <Route
          path="/admin/login"
          element={
            <AdminLogin
              onLogin={(role) => {
                if (role === "admin") navigate("/admin", { replace: true });
              }}
            />
          }
        />

        <Route
          path="/user/login"
          element={
            <UserLogin
              onLogin={(role) => {
                if (role === "user") navigate("/user", { replace: true });
              }}
            />
          }
        />

        <Route path="/user/register" element={<UserRegister />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRole="admin">
              <>
                <button className="btn-delete" onClick={logoutUser}>
                  Logout
                </button>

                <AdminPanel
                  refresh={refresh}
                  reload={reloadStudents}
                  selectedStudent={selectedStudent}
                  setSelected={setSelectedStudent}
                  showToast={showToast}
                />
              </>
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowRole="user">
              <>
                <button className="btn-delete" onClick={logoutUser}>
                  Logout
                </button>

                <UserPanel
                  refresh={refresh}
                  showToast={showToast}
                />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
