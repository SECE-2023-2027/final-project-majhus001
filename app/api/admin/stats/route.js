import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Team from '@/lib/models/teamModel';
import Evaluation from '@/lib/models/evaluationModel';

export async function GET() {
  await connectDB();

  try {
    const teams = await Team.find();
    const evaluations = await Evaluation.find();

    const totalTeams = teams.length;
    const evaluatedTeamNames = new Set(evaluations.map(e => e.teamName));
    const evaluatedTeams = evaluatedTeamNames.size;
    const unevaluatedTeams = totalTeams - evaluatedTeams;

    let totalStudents = 0;
    teams.forEach(team => {
      totalStudents += team.members.length;
    });

    const recent = evaluations.slice(-5).reverse().map(e => ({
      evaluator: e.evaluator,
      teamName: e.teamName,
    }));

    const teamStatus = teams.map(team => ({
      name: team.teamName,
      evaluated: evaluatedTeamNames.has(team.teamName),
    }));

    return NextResponse.json({
      totalTeams,
      evaluatedTeams,
      unevaluatedTeams,
      totalStudents,
      totalEvaluations: evaluations.length,
      recent,
      teamStatus,
    });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to get stats', error: err.message }, { status: 500 });
  }
}
