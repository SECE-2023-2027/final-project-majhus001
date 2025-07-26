import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Evaluation from "@/lib/models/evaluationModel";


export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const evaluator = searchParams.get("evaluator");
  
  if (!evaluator) {
    return NextResponse.json(
      { message: "Missing evaluator or teamName" },
      { status: 400 }
    );
  }

  try {
    const existing = await Evaluation.findOne({ evaluator });

    if (existing) {
      console.log(existing)
      return NextResponse.json(
        { success: true, evaluated: true, message: "Already evaluated", data: existing },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: true, evaluated: false, message: "Not evaluated yet" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { success: false, message: "Error", error: err.message },
      { status: 500 }
    );
  }
}
