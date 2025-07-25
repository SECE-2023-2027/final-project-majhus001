"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TeamEvaluationPage() {
  const { teamName: rawTeamName } = useParams();
  const teamName = decodeURIComponent(rawTeamName);

  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const res = await fetch(
        `/api/admin/evaluations/${encodeURIComponent(teamName)}`
      );

      const data = await res.json();
      setEvaluations(data.evaluations || []);
    };

    fetchEvaluations();
  }, [teamName]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📊 Team: {teamName}</h1>

        {evaluations.length === 0 ? (
          <p>No evaluations for this team.</p>
        ) : (
          evaluations.map((evalItem, index) => (
            <div
              key={index}
              className="bg-white rounded shadow p-5 mb-6 border"
            >
              <h2 className="text-lg font-semibold mb-1">
                🧑 Evaluator:{" "}
                <span className="text-blue-700">{evalItem.evaluator}</span>
              </h2>

              {evalItem.evaluations.map((peerEval, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded border mb-3">
                  <h4 className="font-medium">👤 Peer: {peerEval.peer}</h4>
                  <p>📈 Contribution: {peerEval.contribution} / 5</p>
                  <p>🤝 Teamwork: {peerEval.teamwork} / 5</p>
                  <p>📝 Comment: {peerEval.comments}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
