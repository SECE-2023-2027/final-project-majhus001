import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Evaluation from "@/lib/models/evaluationModel";


// GET /api/evaluate/recent
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const evaluator = searchParams.get("evaluator");

  if (!evaluator) {
    return NextResponse.json(
      { message: "Missing evaluator email" },
      { status: 400 }
    );
  }

  try {
    const evaluations = await Evaluation.find({ evaluator }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: evaluations },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { success: false, message: "Error", error: err.message },
      { status: 500 }
    );
  }
}
