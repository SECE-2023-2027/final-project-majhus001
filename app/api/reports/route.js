import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Team from "@/lib/models/teamModel";
import Student from "@/lib/models/studentModel";
import Evaluation from "@/lib/models/evaluationModel";

export async function GET() {
  await connectDB();

  const teams = await Team.find();
  const students = await Student.find();
  const evals = await Evaluation.find();

  const totalStudents = students.length;
  const totalEvaluations = evals.length;

  let scoreSum = 0, scoredCount = 0;
  const studentMap = {};

  students.forEach(s => {
    studentMap[s.email] = {
      name: s.name,
      email: s.email,
      team: null,
      avgScore: 0,
      count: 0,
    };
  });

  teams.forEach(t => {
    t.members.forEach(m => {
      if (studentMap[m.email]) studentMap[m.email].team = t.teamName;
    });
  });

  evals.forEach(e => {
    e.evaluations.forEach(r => {
      const obj = studentMap[r.peer];
      if (obj) {
        const avg = (r.contribution + r.teamwork) / 2;
        obj.avgScore += avg;
        obj.count++;
        scoreSum += avg;
        scoredCount++;
      }
    });
  });

  const overallLeaderboard = Object.values(studentMap)
    .filter(s => s.count > 0)
    .map(s => ({ ...s, avgScore: s.avgScore / s.count }))
    .sort((a,b) => b.avgScore - a.avgScore)
    .slice(0, 10);

  const teamReports = teams.map(t => {
    const members = t.members.map(m => {
      const s = studentMap[m.email];
      return {
        name: s?.name || m.email,
        email: m.email,
        avgScore: s && s.count > 0 ? s.avgScore / s.count : 0,
      };
    }).sort((a,b) => b.avgScore - a.avgScore);

    return {
      teamName: t.teamName,
      members,
      total: members.length,
    };
  });

  const pendingTeams = teams
    .filter(t => !evals.some(e => e.teamName === t.teamName))
    .map(t => t.teamName);

  const avgScore = scoredCount ? scoreSum / scoredCount : 0;

  return NextResponse.json({
    totalStudents, totalEvaluations, avgScore,
    pendingTeams, overallLeaderboard, teamReports
  });
}
