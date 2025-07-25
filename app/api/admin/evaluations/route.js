import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Evaluation from "@/lib/models/evaluationModel";

export async function GET() {
  await connectDB();

  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
    return NextResponse.json({ evaluations });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch evaluations", error: error.message },
      { status: 500 }
    );
  }
}
