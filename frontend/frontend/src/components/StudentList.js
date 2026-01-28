import { useEffect, useState } from "react";
import API from "../services/api";
import "./Student.css";

function StudentList({ selectedUser }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!selectedUser?.id) return;

    const loadStudents = async () => {
      try {
        const res = await API.get(`students/?user=${selectedUser.id}`);
        setStudents(res.data || []);
      } catch (err) {
        console.log("Load error:", err);
        setStudents([]);
      }
    };

    loadStudents();
  }, [selectedUser]);

  return (
    <div>
      <h2>
        Records for {selectedUser?.username || "Selected User"}
      </h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.name || "—"}</td>
                <td>{s.email || "—"}</td>
                <td>{s.course || "—"}</td>
                <td>
                  {s.created_at
                    ? new Date(s.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
