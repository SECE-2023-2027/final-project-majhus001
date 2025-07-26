"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EvaluatePage() {
  const { teamName } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState(null);
  const [teammates, setTeammates] = useState([]);
  const [formData, setFormData] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  // Get current user
  useEffect(() => {
    const initializeUser = () => {
      if (status === "authenticated") {
        setUser({
          ...session.user,
          role: session.user.role || "Student",
        });
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

  // Fetch teammates only when user is ready
  useEffect(() => {
    const fetchTeammates = async () => {
      if (!user?.email) return;

      try {
        const evaluationCheck = await fetch(
          `/api/evaluate?evaluator=${encodeURIComponent(
            user?.email
          )}&teamName=${encodeURIComponent(teamName)}`
        );
        const evaluationData = await evaluationCheck.json();

        if (evaluationData.evaluated) {
          setAlreadyEvaluated(true);
          setMessage({
            text: "You've already submitted an evaluation for this team.",
            type: "info",
          });
          return;
        }

        // If not evaluated, fetch team data
        const res = await fetch(
          `/api/team?teamName=${encodeURIComponent(teamName)}`
        );
        const data = await res.json();

        const others = data.team.members.filter((m) => m.email !== user.email);

        setTeammates(others);
        setFormData(
          others.map((member) => ({
            peer: member.email,
            contribution: 0,
            teamwork: 0,
            comments: "",
          }))
        );
      } catch (err) {
        console.error("Error fetching teammates:", err);
        setMessage({ text: "Failed to load teammates", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTeammates();
  }, [user, teamName]);

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadyEvaluated) return;

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const payload = {
      evaluator: user?.email,
      teamName,
      evaluations: formData,
    };

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({
          text: "Evaluation submitted successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => router.push("/user/dashboard"), 1500);
      } else {
        const data = await res.json();
        setMessage({
          text: data.message || "Submission failed. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({
        text: "Server error. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading evaluation form...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Team Evaluation:{" "}
            <span className="text-blue-600">
              {decodeURIComponent(teamName)}
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  Evaluation Guidelines
                </h2>
                <p className="text-sm text-gray-600">
                  Please rate each teammate honestly and provide constructive
                  feedback. All fields are required.
                </p>
              </div>
            </div>
          </div>

          {alreadyEvaluated ? (
            <div className="p-6 text-center">
              <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4">
                <p>You&apos;ve already submitted an evaluation for this team.</p>
              </div>
              <button
                onClick={() => router.push("/user/dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="divide-y">
              {teammates.map((member, index) => (
                <div
                  key={member.email}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contribution (0-5)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={5}
                          step={1}
                          value={formData[index]?.contribution}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "contribution",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full accent-blue-500"
                          required
                        />
                        <span className="w-8 text-center font-medium text-gray-700">
                          {formData[index]?.contribution}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minimal</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teamwork (0-5)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={5}
                          step={1}
                          value={formData[index]?.teamwork}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "teamwork",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full accent-blue-500"
                          required
                        />
                        <span className="w-8 text-center font-medium text-gray-700">
                          {formData[index]?.teamwork}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Poor</span>
                        <span>Exceptional</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Constructive Feedback
                    </label>
                    <textarea
                      value={formData[index]?.comments}
                      onChange={(e) =>
                        handleChange(index, "comments", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Provide specific examples of their contributions and teamwork..."
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="p-6 bg-gray-50">
                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      message.type === "error"
                        ? "bg-red-100 text-red-700"
                        : message.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || teammates.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    isSubmitting || teammates.length === 0
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : teammates.length > 0 ? (
                    "Submit Evaluation"
                  ) : (
                    "No Teammates to Evaluate"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
