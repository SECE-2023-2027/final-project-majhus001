'use client';
import { useState, useEffect } from 'react';

export default function UpdateTeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch suggestions
  const fetchSuggestions = async (term) => {
    const res = await fetch(`/api/team/search?query=${term}`);
    const data = await res.json();
    setSuggestions(data.teams || []);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) fetchSuggestions(term);
    else setSuggestions([]);
  };

  const selectTeam = async (teamName) => {
    const res = await fetch(`/api/team?teamName=${teamName}`);
    const data = await res.json();
    setTeamData(data.team);
    setSuggestions([]);
    setSearchTerm(teamName);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamData.members];
    updated[index][field] = value;
    setTeamData({ ...teamData, members: updated });
  };

  const addMember = () => {
    setTeamData({
      ...teamData,
      members: [...teamData.members, { name: '', email: '' }],
    });
  };

  const removeMember = (index) => {
    const updated = [...teamData.members];
    updated.splice(index, 1);
    setTeamData({ ...teamData, members: updated });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/team', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });

    if (res.ok) {
      setMessage('✅ Team updated successfully!');
    } else {
      setMessage('❌ Failed to update team.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🔍 Update a Team</h1>

        <input
          type="text"
          placeholder="Search team name..."
          className="w-full border px-3 py-2 rounded mb-4"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {suggestions.length > 0 && (
          <div className="bg-white border rounded shadow mb-4 max-h-40 overflow-y-auto">
            {suggestions.map((team) => (
              <div
                key={team._id}
                onClick={() => selectTeam(team.teamName)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {team.teamName}
              </div>
            ))}
          </div>
        )}

        {teamData && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block font-medium">Team Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mt-1"
                value={teamData.teamName}
                readOnly
              />
            </div>

            {teamData.members.map((member, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full border px-3 py-2 mb-2"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Student Email"
                  className="w-full border px-3 py-2"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                  required
                />
                {teamData.members.length > 1 && (
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
              ➕ Add Student
            </button>

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              🔁 Update Team
            </button>

            {message && <p className="text-center mt-4">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
