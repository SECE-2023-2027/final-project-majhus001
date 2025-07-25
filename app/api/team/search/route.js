import { connectDB } from "@/lib/dbConnect";
import Team from "../../../../lib/models/teamModel";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  
  if (!query) {
    return Response.json({ message: "Query required" }, { status: 400 });
  }

  const teams = await Team.find({
    teamName: { $regex: query, $options: "i" },
  }).select("teamName");

  return Response.json({ teams });
}
