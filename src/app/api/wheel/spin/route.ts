import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Team from "@/models/Team";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const teamId = (session?.user as any)?.teamId;

    if (!session || !session.user || (role !== "CAPTAIN" && role !== "ADMIN") || !teamId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { result } = await req.json();

    if (!result) {
      return NextResponse.json({ error: "Missing wheel result" }, { status: 400 });
    }

    await dbConnect();

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (team.wheelResult) {
      return NextResponse.json({ error: "You have already spun the wheel!" }, { status: 400 });
    }

    team.wheelResult = result;
    await team.save();

    return NextResponse.json({ success: true, wheelResult: result });
  } catch (error: any) {
    console.error("Wheel spin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
