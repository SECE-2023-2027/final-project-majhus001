"use client";
import { useState, useRef } from "react";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", rollNo: "" }]);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // 🧠 track current typing student

  const handleMemberChange = (i, field, val) => {
    const updated = [...members];
    updated[i][field] = val;
    setMembers(updated);

    if (field === "rollNo") {
      setActiveIndex(i);
      if (val.trim()) fetchSuggestions(val);
      else setSuggestions([]);
    }
  };

  const fetchSuggestions = async (val) => {
    const res = await fetch(`/api/students/search?rollNo=${encodeURIComponent(val)}`);
    const { students } = await res.json();
    setSuggestions(students || []);
  };

  const chooseSuggestion = (i, student) => {
    const updated = [...members];
    updated[i] = {
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
    };
    setMembers(updated);
    setSuggestions([]);
    setActiveIndex(null);
  };

  const addMember = () => {
    setMembers([...members, { name: "", email: "", rollNo: "" }]);
    setSuggestions([]);
    setActiveIndex(null);
  };

  const removeMember = (i) => {
    const updated = [...members];
    updated.splice(i, 1);
    setMembers(updated);
    setSuggestions([]);
    setActiveIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, members }),
    });

    if (res.ok) {
      setMessage("✅ Team created!");
      setTeamName("");
      setMembers([{ name: "", email: "", rollNo: "" }]);
    } else {
      const err = await res.json();
      setMessage("❌ " + (err.message || "Server error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create a Team</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Team Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          {members.map((mem, i) => (
            <div key={i} className="relative bg-gray-50 p-4 rounded border">
              <h2 className="font-semibold mb-2">Student {i + 1}</h2>

              {/* 🟡 ROLL NO */}
              <input
                type="text"
                placeholder="Roll number"
                value={mem.rollNo}
                onChange={(e) => handleMemberChange(i, "rollNo", e.target.value)}
                className="w-full border px-3 py-2 mb-2"
                required
                onFocus={() => setActiveIndex(i)}
              />

              
              {activeIndex === i && suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded shadow-md w-full z-10 max-h-48 overflow-auto">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => chooseSuggestion(i, s)}
                    >
                      {s.rollNo} — {s.name}
                    </li>
                  ))}
                </ul>
              )}

              {/* 👨‍🎓 NAME */}
              <input
                type="text"
                placeholder="Student Name"
                className="w-full border px-3 py-2 mb-2"
                value={mem.name}
                onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                required
              />

              {/* 📧 EMAIL */}
              <input
                type="email"
                placeholder="Student Email"
                className="w-full border px-3 py-2"
                value={mem.email}
                onChange={(e) => handleMemberChange(i, "email", e.target.value)}
                required
              />

              {/* ❌ Remove */}
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(i)}
                  className="text-red-600 mt-2"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMember}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Another Student
          </button>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Create Team
          </button>

          {message && <p className="mt-4 text-center font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}
