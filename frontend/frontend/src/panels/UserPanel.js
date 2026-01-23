import { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import "../components/Student.css";

function UserPanel({ refresh, showToast }) {
  const [localRefresh, setLocalRefresh] = useState(false);

  // Logged-in user
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const reloadStudents = () => {
    setLocalRefresh(!localRefresh);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("ME API RESPONSE:", res.data);

        // Backend STEP-1 sends username directly
        setUsername(res.data.username);
      } catch (error) {
        console.log("User fetch failed:", error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="panel-container">
      <h1>My Student Records</h1>

      {/* Welcome message */}
      <h2>
        {loading
          ? "Loading user..."
          : username
          ? `Welcome, ${username}`
          : "Welcome"}
      </h2>

      <StudentForm
        onStudentAdded={() => {
          reloadStudents();
          showToast("Student saved successfully!");
        }}
      />

      <StudentList
        refresh={localRefresh}
        showToast={showToast}
      />
    </div>
  );
}

export default UserPanel;
