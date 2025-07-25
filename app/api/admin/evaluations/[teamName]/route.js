import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Evaluation from '@/lib/models/evaluationModel';

export async function GET(req, { params }) {
  await connectDB();
  const rawTeamName = params.teamName;
  const teamName = decodeURIComponent(rawTeamName);

  try {
    const evaluations = await Evaluation.find({ teamName });
    return NextResponse.json({ evaluations });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
