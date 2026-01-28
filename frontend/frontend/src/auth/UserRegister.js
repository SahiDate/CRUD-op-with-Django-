import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../components/Student.css";

function UserRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      alert(res.data.message || "Registration successful!");
      navigate("/user/login");

    } catch (err) {
      const errorData = err.response?.data;

      alert(
        errorData?.username?.[0] ||
        errorData?.email?.[0] ||
        errorData?.password?.[0] ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">User Registration</div>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="login-btn" type="submit">
          Register
        </button>
      </form>

      <div style={{ marginTop: "15px" }}>
        <Link to="/user/login" style={{ color: "#007bff" }}>
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default UserRegister;
