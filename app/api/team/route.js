import { connectDB } from "@/lib/dbConnect";
import Team from "../../../lib/models/teamModel";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { teamName, members } = body;

  if (!teamName || !Array.isArray(members) || members.length === 0) {
    return Response.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const existing = await Team.findOne({ teamName });
    if (existing) {
      return Response.json({ message: "Team already exists" }, { status: 409 });
    }

    const newTeam = new Team({ teamName, members });
    await newTeam.save();


    return Response.json({ message: "Team created" }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const teamName = searchParams.get('teamName');

  if (!teamName) {
    return Response.json({ message: 'Team name required' }, { status: 400 });
  }

  const team = await Team.findOne({ teamName });
  if (!team) {
    return Response.json({ message: 'Team not found' }, { status: 404 });
  }

  return Response.json({ team });
}

export async function PUT(req) {
  await connectDB();
  const data = await req.json();
  const { teamName, members } = data;

  if (!teamName || !Array.isArray(members) || members.length === 0) {
    return Response.json({ message: 'Invalid data' }, { status: 400 });
  }

  const updated = await Team.findOneAndUpdate(
    { teamName },
    { members },
    { new: true }
  );

  if (!updated) {
    return Response.json({ message: 'Team not found' }, { status: 404 });
  }

  return Response.json({ message: 'Team updated', team: updated });
}
