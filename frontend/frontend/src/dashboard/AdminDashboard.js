import { useEffect, useState } from "react";
import API from "../services/api";

import StatCard from "./StatCard";
import Charts from "./Charts";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("7"); // days filter

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`stats/?days=${range}`);
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Admin access only.");
      } else {
        setError("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadStats();

  // 🔄 Auto refresh every 30 seconds
  const interval = setInterval(() => {
    loadStats();
  }, 30000);

  return () => clearInterval(interval);
}, [range]);


  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* 🔽 FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <label>Show data for last: </label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>

      {/* 🔢 STAT CARDS */}
      <div className="stat-grid">
        <StatCard title="Total Users" value={stats.total_users} />
        <StatCard title="Total Admins" value={stats.total_admins} />
        <StatCard title="Total Students" value={stats.total_students} />
        <StatCard title="Students Today" value={stats.students_today} />
      </div>

      {/* 📊 CHARTS */}
      <Charts studentsPerUser={stats.students_per_user} />
    </div>
  );
}
