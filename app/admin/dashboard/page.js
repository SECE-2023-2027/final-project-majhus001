"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-10">Loading dashboard...</div>;

  const {
    totalTeams,
    evaluatedTeams,
    unevaluatedTeams,
    totalStudents,
    totalEvaluations,
    recent,
    teamStatus,
  } = stats;

  const submissionRate = Math.round((evaluatedTeams / totalTeams) * 100 || 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">🧑‍🏫 Admin Dashboard</h1>

      {/* 🎯 Quick Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/create-team")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create New Team
        </button>
        <button
          onClick={() => router.push("/admin/update-team")}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          ✏️ Update Existing Team
        </button>
        <button
          onClick={() => router.push("/admin/evaluations")}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          📂 View All Evaluations
        </button>
        <button
          onClick={() => router.push("/admin/add-student")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Add Student
        </button>
        <button
          onClick={() => router.push("/admin/view-students")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📚 View All Students
        </button>
        <button
          onClick={() => router.push("/admin/view-students")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📚 View All Reports
        </button>
      </div>

      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="📦 Total Teams" value={totalTeams} />
        <StatCard label="✅ Teams Evaluated" value={evaluatedTeams} />
        <StatCard label="❌ Not Evaluated" value={unevaluatedTeams} />
        <StatCard label="👥 Total Students" value={totalStudents} />
        <StatCard label="📝 Total Evaluations" value={totalEvaluations} />
        <StatCard label="📈 Submission Rate" value={`${submissionRate}%`} />
      </div>

      {/* 🗂 Team Status Table */}
      <h2 className="text-xl font-semibold mb-3">📋 Team Evaluation Status</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Team Name</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamStatus.map((team, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{team.name}</td>
                <td className="p-3">
                  {team.evaluated ? (
                    <span className="text-green-600 font-medium">
                      ✅ Submitted
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ❌ Not Submitted
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🕒 Recent */}
      <h2 className="text-xl font-semibold mt-10 mb-3">
        📅 Recent Submissions
      </h2>
      <ul className="bg-white p-4 rounded shadow space-y-2">
        {recent.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          recent.map((item, idx) => (
            <li key={idx} className="border-b pb-2">
              🧑 <b>{item.evaluator}</b> submitted for team{" "}
              <b>{item.teamName}</b>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded shadow text-center">
      <div className="text-lg font-medium text-gray-600">{label}</div>
      <div className="text-2xl font-bold mt-2 text-blue-700">{value}</div>
    </div>
  );
}
