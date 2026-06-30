import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import GameState from "@/models/GameState";
import Team from "@/models/Team";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  await dbConnect();

  const gameState = await GameState.findOne() || {
    currentRound: 1,
    isActive: false,
    isCompleted: false,
    inputs: {},
  };

  const team = (session.user as any).teamId 
    ? await Team.findById((session.user as any).teamId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-gold mb-2">
            Welcome, {session.user.name}
          </h1>
          <p className="text-ocean-200">
            {team ? `Crew: ${team.name}` : "You are a lone pirate. Await crew assignment."}
          </p>
        </div>
        <div className="bg-wood-800 border-2 border-wood-600 px-6 py-3 rounded-lg shadow-lg text-center">
          <p className="text-sm text-ocean-200 uppercase tracking-wider">Current Bounty</p>
          <p className="text-3xl font-bold text-treasure-400">
            ฿ {team ? team.score : 0}
          </p>
        </div>
      </div>

      <DashboardClient 
        gameState={JSON.parse(JSON.stringify(gameState))} 
        userRole={(session.user as any).role} 
        teamId={(session.user as any).teamId} 
        animationStyle={(session.user as any).themeData?.animationStyle || "bounce"}
        motifIcon={(session.user as any).themeData?.motifIcon || "Anchor"}
        motifText={(session.user as any).themeData?.motifText || "PIRATES"}
      />
    </div>
  );
}
