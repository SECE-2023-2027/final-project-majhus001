import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Student from "@/lib/models/studentModel";

// POST → Add student
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, rollNo, email, role } = body;

  if (!name || !rollNo || !email || !role) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  try {
    const existing = await Student.findOne({ $or: [{ rollNo }, { email }] });
    if (existing) {
      return NextResponse.json(
        { message: "Student already exists" },
        { status: 409 }
      );
    }

    const newStudent = await Student.create({
      name,
      rollNo,
      email,
      role,
      password: "Sece@2023",
      type: "Student",
    });

    console.log("✅ Student created:", newStudent);

    return NextResponse.json({ message: "Student added!" }, { status: 201 });
  } catch (err) {
    console.error("❌ Student Add Error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// GET → View all students
export async function GET() {
  await connectDB();

  try {
    const students = await Student.find().sort({ name: 1 });
    return Response.json({ students });
  } catch (err) {
    return Response.json(
      { message: "Failed to fetch", error: err.message },
      { status: 500 }
    );
  }
}
