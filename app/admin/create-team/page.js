'use client'
import { useState } from "react";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", rollNo:"" }]);
  const [message, setMessage] = useState("");

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, { name: "", email: "" , rollNo:""}]);
  };

  const removeMember = (index) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, members }),
    });

    if (res.ok) {
      setMessage("✅ Team created successfully!");
      setTeamName("");
      setMembers([{ name: "", email: "", rollNo:"" }]);
    } else {
      setMessage("❌ Failed to create team.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">👩‍🏫 Create a Team</h1>

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

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border">
                <h2 className="font-semibold mb-2">Student {index + 1}</h2>
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full border px-3 py-2 mb-2"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Roll number"
                  className="w-full border px-3 py-2 mb-2"
                  value={member.rollNo}
                  onChange={(e) => handleMemberChange(index, "rollNo", e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Student Email"
                  className="w-full border px-3 py-2"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                  required
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
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
          </div>

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
