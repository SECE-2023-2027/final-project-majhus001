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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Get current user
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

  // ✅ Fetch teammates only when user is ready
  useEffect(() => {
    const fetchTeammates = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(`/api/team?teamName=${teamName}`);
        const data = await res.json();

        const others = data.team.members.filter(
          (m) => m.email !== user.email
        );

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
        console.error("❌ Error fetching teammates:", err);
        setMessage("Failed to load teammates");
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
        setMessage("✅ Evaluation submitted!");
        setTimeout(() => router.push("/user/dashboard"), 1500);
      } else {
        const data = await res.json();
        setMessage("❌ " + (data.message || "Something went wrong."));
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Server error. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          📝 Evaluate Team: {decodeURIComponent(teamName)}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {teammates.map((member, index) => (
            <div
              key={member.email}
              className="border p-4 rounded bg-gray-50 shadow"
            >
              <h2 className="font-semibold mb-2">{member.name}</h2>

              <label className="block">Contribution (0-5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={formData[index]?.contribution}
                onChange={(e) =>
                  handleChange(index, "contribution", parseInt(e.target.value))
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block mt-3">Teamwork (0-5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={formData[index]?.teamwork}
                onChange={(e) =>
                  handleChange(index, "teamwork", parseInt(e.target.value))
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label className="block mt-3">Comments</label>
              <textarea
                value={formData[index]?.comments}
                onChange={(e) =>
                  handleChange(index, "comments", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ✅ Submit Evaluation
          </button>

          {message && <p className="text-center mt-4 font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}
