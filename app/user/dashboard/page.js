"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize user from session or localStorage
  useEffect(() => {
    const initializeUser = () => {
      if (status === "authenticated") {
        const sessionUser = {
          ...session.user,
          role: session.user.role || "Student",
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

  // Fetch teams and evaluations when user is ready
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      try {
        // Fetch teams
        const teamsRes = await fetch(`/api/student-teams?email=${user.email}`);
        const teamsData = await teamsRes.json();
        setTeams(teamsData.teams || []);

        // Fetch recent evaluations
        const evalRes = await fetch(
          `/api/evaluate/recent?evaluator=${encodeURIComponent(user.email)}`
        );
        const evalData = await evalRes.json();
        
        // Normalize data to always be an array
        if (Array.isArray(evalData.data)) {
          setRecentEvaluations(evalData.data);
        } else if (evalData && !Array.isArray(evalData.data)) {
          setRecentEvaluations([evalData.data]);
        } else {
          setRecentEvaluations([]);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setTeams([]);
        setRecentEvaluations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.email.split("@")[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Here are your current teams and evaluations</p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-sm">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Your Teams
          </h2>

          {teams.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-3 text-gray-500">No teams found for you yet</p>
              <button
                onClick={() => router.push("/teams/join")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Join a Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group"
                  onClick={() =>
                    router.push(
                      `/user/evaluate/${encodeURIComponent(team.teamName)}`
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to evaluate this team
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Evaluations Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Recent Evaluations
          </h2>

          {recentEvaluations.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-3 text-gray-500">No recent evaluations found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recentEvaluations.map((evaluation) => (
                <div key={evaluation._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Team: {evaluation.teamName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Evaluated on {formatDate(evaluation.createdAt)}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {evaluation.evaluations.length} members evaluated
                    </span>
                  </div>

                  <div className="space-y-4">
                    {evaluation.evaluations.map((item) => (
                      <div key={item._id} className="border-l-4 border-blue-200 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-700">
                            {item.peer.split('@')[0]}
                          </h4>
                          <div className="flex gap-4">
                            <div className="flex items-center">
                              <span className="text-gray-500 text-sm mr-1">Contribution:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < item.contribution ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 text-sm mr-1">Teamwork:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < item.teamwork ? 'text-green-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {item.comments && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            "{item.comments}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}