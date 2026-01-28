import { useEffect, useState } from "react";
import axios from "axios";
import StudentList from "../components/StudentList";
import "../components/Student.css";
import AdminDashboard from "../dashboard/AdminDashboard";


function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Panel — All Users</h1>

      <AdminDashboard />


      {/* USERS TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr
                key={u.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(u)}
              >
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <hr />

      {/* RECORDS — ONLY SHOW WHEN USER SELECTED */}
      {selectedUser ? (
        <StudentList selectedUser={selectedUser} />
      ) : (
        <h3 style={{ textAlign: "center" }}>
          Click a user to view their records
        </h3>
      )}
    </div>
  );
}

export default AdminPanel;
