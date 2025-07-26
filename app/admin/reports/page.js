"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  useEffect(() => {
    fetch("/api/reports").then(r => r.json()).then(setReports);
  }, []);

  if (!reports) return <div className="p-10">Loading reports...</div>;

  const { totalStudents, totalEvaluations, avgScore, pendingTeams, overallLeaderboard, teamReports } = reports;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Peer Evaluation Reports</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="👥 Total Students" value={totalStudents} />
        <SummaryCard title="📤 Evaluations Submitted" value={totalEvaluations} />
        <SummaryCard title="💡 Avg Score" value={avgScore.toFixed(2)} />
        <SummaryCard title="❌ Pending Teams" value={pendingTeams.length} />
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">🏆 Overall Leaderboard</h2>
      <LeaderboardTable data={overallLeaderboard} />

      <h2 className="text-xl font-semibold mt-8 mb-4">📁 Team Reports</h2>
      {teamReports.map(team => (
        <div key={team.teamName} className="mb-6 border p-4 rounded bg-white">
          <h3 className="font-bold mb-2 text-lg">Team: {team.teamName}</h3>
          <LeaderboardTable data={team.members} />
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded text-center">
      <h4 className="text-gray-500">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function LeaderboardTable({ data }) {
  return (
    <table className="w-full border text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Avg Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{s.name}</td>
            <td className="p-2">{s.email}</td>
            <td className="p-2">{s.avgScore.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
