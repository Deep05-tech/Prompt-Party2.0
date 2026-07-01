import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import GameState from "@/models/GameState";
import Submission from "@/models/Submission";
import Team from "@/models/Team";
import User from "@/models/User";
import AdminDashboardClient from "./AdminDashboardClient";
import TeamManagement from "./TeamManagement";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const role = session?.user ? (session.user as any).role : null;
  if (!session || !session.user || role !== "ADMIN") {
    redirect("/dashboard");
  }

  await dbConnect();

  let gameState = await GameState.findOne();
  if (!gameState) {
    gameState = await GameState.create({
      currentRound: 1,
      isActive: false,
      inputs: {}
    });
  }

  const submissions = await Submission.find().populate({
    path: "teamId",
    model: Team,
    select: "name"
  }).sort({ createdAt: -1 }).lean();

  const teams = await Team.find().populate({
    path: "captainId",
    model: User,
    select: "username"
  }).populate({
    path: "members",
    model: User,
    select: "username"
  }).lean();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-serif text-treasure-400 mb-8 flex items-center gap-3">
        <span>👑</span> Fleet Admiral Control Room
      </h1>

      <AdminDashboardClient 
        initialGameState={JSON.parse(JSON.stringify(gameState))}
        submissions={JSON.parse(JSON.stringify(submissions))}
        teams={JSON.parse(JSON.stringify(teams))}
      />

      <TeamManagement teams={JSON.parse(JSON.stringify(teams))} />
    </div>
  );
}
