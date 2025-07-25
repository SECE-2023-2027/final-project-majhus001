import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Evaluation from '@/lib/models/evaluationModel';

export async function GET() {
  await connectDB();

  try {
    const teamNames = await Evaluation.distinct('teamName');
    return NextResponse.json({ teams: teamNames });
  } catch (err) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
