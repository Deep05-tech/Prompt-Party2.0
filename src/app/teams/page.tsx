import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Team from "@/models/Team";
import User from "@/models/User";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();

  // Fetch teams and populate members
  const teams = await Team.find().populate({
    path: 'members',
    model: User,
    select: 'username role'
  }).populate({
    path: 'captainId',
    model: User,
    select: 'username role'
  }).sort({ score: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-serif text-gold mb-2 flex items-center justify-center gap-3">
          <span>🏴‍☠️</span> The Grand Fleet <span>🏴‍☠️</span>
        </h1>
        <p className="text-ocean-200">Current Bounties and Active Pirate Crews</p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center p-12 bg-wood-800/50 rounded-xl border border-wood-600">
          <p className="text-xl text-ocean-300">No crews have been formed yet. The Fleet Admiral is assembling them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <div key={team._id.toString()} className="bg-wood-800/80 backdrop-blur border-2 border-wood-600 rounded-xl p-6 shadow-xl relative group hover:border-treasure-500 transition-colors">
              {/* Rank Badge */}
              <div className="absolute -top-4 -right-4 bg-ocean-900 border-2 border-gold w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-treasure-400 shadow-lg">
                #{index + 1}
              </div>

              <h2 className="text-2xl font-serif text-white mb-1 truncate pr-8">{team.name}</h2>
              <div className="text-sm font-semibold text-ocean-300 mb-4 px-2 py-1 bg-ocean-950/50 inline-block rounded">
                Status: {team.status}
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-wood-400 mb-1">Bounty</div>
                <div className="text-3xl font-bold text-treasure-400 font-mono">
                  ฿ {team.score.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded border border-wood-700">
                  <div className="text-xs text-wood-400 mb-1 flex items-center gap-1">
                    <span>👑</span> Captain
                  </div>
                  <div className="font-medium text-ocean-50">
                    {(team.captainId as any)?.username || "Unknown"}
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded border border-wood-700">
                  <div className="text-xs text-wood-400 mb-1 flex items-center gap-1">
                    <span>⚔️</span> Crew Members
                  </div>
                  <ul className="text-sm text-ocean-200 space-y-1">
                    {team.members.length > 0 ? team.members.map((member: any) => (
                      <li key={member._id.toString()}>• {member.username}</li>
                    )) : (
                      <li className="italic text-ocean-500">No crew members yet</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
