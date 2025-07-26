import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Evaluation from "@/lib/models/evaluationModel";

// 🔵 Save Evaluation (POST)
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { evaluator, teamName, evaluations } = body;

  if (!evaluator || !teamName || !evaluations || !Array.isArray(evaluations)) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    // Check if already submitted
    const alreadySubmitted = await Evaluation.findOne({ evaluator, teamName });
    if (alreadySubmitted) {
      return NextResponse.json(
        { message: "Evaluation already submitted!" },
        { status: 409 }
      );
    }

    // Save new evaluation
    const newEval = new Evaluation({ evaluator, teamName, evaluations });
    await newEval.save();

    return NextResponse.json(
      { message: "✅ Evaluation saved!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving evaluation:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// 🟢 Check if already evaluated (GET)
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const evaluator = searchParams.get("evaluator");
  const teamName = searchParams.get("teamName");
  console.log(teamName);

  if (!evaluator || !teamName) {
    return NextResponse.json(
      { message: "Missing evaluator or teamName" },
      { status: 400 }
    );
  }

  try {
    const existing = await Evaluation.findOne({ evaluator, teamName });

    console.log(existing);
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          evaluated: true,
          message: "Already evaluated",
          data: existing,
        },
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
