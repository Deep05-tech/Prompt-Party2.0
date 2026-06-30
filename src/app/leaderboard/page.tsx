import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Team from "@/models/Team";

// This page can be auto-refreshed using client-side fetching, but for simplicity, we use Server Components and revalidate
export const revalidate = 10; // Revalidate every 10 seconds

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();

  const teams = await Team.find().sort({ score: -1 }).select("name score");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif text-gold mb-4 uppercase tracking-widest drop-shadow-xl">
          Wanted Bounties
        </h1>
        <p className="text-ocean-200">The most notorious crews on the Grand Line</p>
      </div>

      <div className="space-y-4">
        {teams.map((team, index) => (
          <div 
            key={team._id.toString()} 
            className={`flex items-center justify-between p-6 rounded-lg border-l-4 ${
              index === 0 ? "bg-wood-800/90 border-treasure-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : 
              index === 1 ? "bg-wood-800/80 border-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.5)]" :
              index === 2 ? "bg-wood-800/70 border-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" :
              "bg-ocean-950/50 border-ocean-700"
            } transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-6">
              <span className={`text-3xl font-bold font-serif ${
                index === 0 ? "text-treasure-400" :
                index === 1 ? "text-gray-400" :
                index === 2 ? "text-amber-600" :
                "text-ocean-400"
              }`}>
                #{index + 1}
              </span>
              <span className="text-2xl text-white font-serif tracking-wide">{team.name}</span>
            </div>
            
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-ocean-400 mb-1">Bounty</div>
              <div className="text-2xl font-bold text-treasure-400 font-mono">
                ฿ {team.score.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
