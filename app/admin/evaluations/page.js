'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTeamListPage() {
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch('/api/admin/teams');
      const data = await res.json();
      setTeams(data.teams || []);
    };


    fetchTeams();
  }, []);

  const handleRoute = (teamName) => {
    console.log(teamName)
    router.push(`/admin/evaluations/${teamName}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📂 Teams With Evaluations</h1>

        {teams.length === 0 ? (
          <p>No evaluations submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {teams.map((team, idx) => (
              <li
                key={idx}
                onClick={() => handleRoute(team)}
                className="p-4 bg-white rounded shadow border hover:bg-gray-100 cursor-pointer"
              >
                🏷️ {team}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
