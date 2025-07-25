'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For smoother UX

  // ✅ Get user from session or localStorage
  useEffect(() => {
    const initializeUser = () => {
      if (status === "authenticated") {
        const sessionUser = {
          ...session.user,
          role: session.user.role || "Student"
        };
        setUser(sessionUser);
      } else {
        const storedUser = localStorage.getItem("CurrentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          router.push("/login");
        }
      }
    };

    initializeUser();
  }, [session, status, router]);

  // ✅ Fetch teams once we have user email
  useEffect(() => {
    const fetchTeams = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(`/api/student-teams?email=${user.email}`);
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error("❌ Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">👋 Welcome, {user?.email}</h1>
        <h2 className="text-lg mb-2 font-semibold">Your Teams:</h2>

        {teams.length === 0 ? (
          <p>No teams found for you.</p>
        ) : (
          <ul className="space-y-3">
            {teams.map((team) => (
              <li
                key={team._id}
                className="bg-white shadow rounded p-4 cursor-pointer hover:bg-blue-50 transition"
                onClick={() => router.push(`/user/evaluate/${encodeURIComponent(team.teamName)}`)}
              >
                🏷️ {team.teamName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
