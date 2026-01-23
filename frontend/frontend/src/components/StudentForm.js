import { useState } from "react";
import API from "../services/api";
import "./Student.css";

function StudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",   // UI ke liye rakhenge, backend ko nahi bhejenge
    strm: ""  // UI ke liye rakhenge, backend me course banake bhejenge
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
      // ✅ Backend ke format me payload bhejo
      const payload = {
        name: formData.name,
        email: formData.email,
        course: formData.strm   // stream → course mapping
      };

      await API.post("students/", payload);

      setFormData({ name: "", email: "", age: "", strm: "" });
      if (onStudentAdded) onStudentAdded();
    } catch (err) {
      console.log("Save error:", err.response?.data || err.message);
      alert("Error saving student");
    }
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>Add Student</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="age"
        type="number"
        placeholder="Age (not saved in backend)"
        value={formData.age}
        onChange={handleChange}
      />

      <input
        name="strm"
        placeholder="Stream / Course"
        value={formData.strm}
        onChange={handleChange}
        required
      />

      <button className="btn-save">Save Student</button>
    </form>
  );
}

export default StudentForm;
