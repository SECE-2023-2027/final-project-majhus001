"use client";
import { useState } from "react";

export default function AddStudentPage() {
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();

    if (res.ok) {
      setMessage("✅ Student added!");
      setForm({ name: "", rollNo: "", email: "", role: "" });
    } else {
      setMessage("❌ " + result.message);
      console.log("💥 Backend Error:", result);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">➕ Add New Student</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="member">Member</option>
            <option value="leader">Leader</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Add Student
          </button>

          {message && <p className="mt-4 font-medium text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
