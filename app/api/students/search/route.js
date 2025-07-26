import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Student from "@/lib/models/studentModel";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("rollNo") || "";

  if (!query.trim()) {
    return NextResponse.json({ students: [] });
  }

  try {
    const regex = new RegExp(`^${query}`, "i");
    const students = await Student.find({
      $or: [{ rollNo: regex }, { name: regex }],
    })
      .limit(5)
      .select("name email rollNo")
      .lean();
    return NextResponse.json({ students });
  } catch (err) {
    return NextResponse.json(
      { students: [], error: err.message },
      { status: 500 }
    );
  }
}
