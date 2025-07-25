import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Evaluation from '@/lib/models/evaluationModel';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { evaluator, teamName, evaluations } = body;

  if (!evaluator || !teamName || !evaluations || !Array.isArray(evaluations)) {
    return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
  }

  try {
    const newEval = new Evaluation({
      evaluator,
      teamName,
      evaluations,
    });
    await newEval.save();

    return NextResponse.json({ message: 'Evaluation saved' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  }
}
