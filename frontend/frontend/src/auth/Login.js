import { useState } from "react";
import API from "../services/api";

function Login({ onLogin, showRegisterLink = false }) {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", formData);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("role", res.data.role);

      // ✅ Let App.js handle navigation (no blank screen)
      if (onLogin) {
        onLogin(res.data.role);
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {showRegisterLink && (
  <div style={{ marginTop: "15px", textAlign: "center" }}>
    <a href="/user/register" style={{ color: "#007bff" }}>
      New user? Register here
    </a>
  </div>
)}

    </div>
  );
}

export default Login;
