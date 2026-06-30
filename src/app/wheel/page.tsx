import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import GameState from "@/models/GameState";
import DevilFruitWheel from "./DevilFruitWheel";

export default async function WheelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Allow captains or admins for testing
  const role = session?.user ? (session.user as any).role : null;
  if (!session?.user || (role !== "CAPTAIN" && role !== "ADMIN")) {
    redirect("/dashboard");
  }

  await dbConnect();

  const gameState = await GameState.findOne();

  // If not round 2, shouldn't be here
  if (!gameState || gameState.currentRound !== 2) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-gold mb-2">Devil Fruit Wheel</h1>
        <p className="text-ocean-200">Spin the wheel to determine your fate for Round 2.</p>
      </div>

      <DevilFruitWheel teamId={(session.user as any).teamId} />
    </div>
  );
}
