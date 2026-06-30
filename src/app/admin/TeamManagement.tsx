"use client";

import { useState } from "react";
import { createTeam, addMemberToTeam, updateTeam, assignCaptain, removeMemberFromTeam } from "./actions";

interface TeamManagementProps {
  teams: any[];
}

export default function TeamManagement({ teams }: TeamManagementProps) {
  const [loading, setLoading] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [editCaptainId, setEditCaptainId] = useState("");

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const teamName = (form.elements.namedItem("teamName") as HTMLInputElement).value;
    const captainUsername = (form.elements.namedItem("captainUsername") as HTMLInputElement).value;

    try {
      await createTeam(teamName, captainUsername);
      alert("Team created successfully!");
      form.reset();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const teamId = (form.elements.namedItem("teamId") as HTMLSelectElement).value;
    const memberUsername = (form.elements.namedItem("memberUsername") as HTMLInputElement).value;

    try {
      await addMemberToTeam(teamId, memberUsername);
      alert("Member added successfully!");
      form.reset();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async (teamId: string, oldCaptainId: string) => {
    setLoading(true);
    try {
      await updateTeam(teamId, editTeamName);
      if (editCaptainId && editCaptainId !== oldCaptainId) {
        await assignCaptain(teamId, editCaptainId);
      }
      setEditingTeamId(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this crew?`)) return;
    setLoading(true);
    try {
      await removeMemberFromTeam(teamId, memberId);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Create Team Form */}
      <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-6 shadow-xl h-fit">
        <h2 className="text-2xl font-serif text-ocean-100 mb-6">Create New Team</h2>
        
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Team Name</label>
            <input
              type="text"
              name="teamName"
              required
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              placeholder="e.g. Straw Hat Pirates"
            />
          </div>
          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Captain Username</label>
            <input
              type="text"
              name="captainUsername"
              required
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              placeholder="e.g. luffy"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-4 rounded shadow-lg transform transition active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>

      {/* Add Member Form */}
      <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-6 shadow-xl h-fit">
        <h2 className="text-2xl font-serif text-ocean-100 mb-6">Enlist Crew Member</h2>
        
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Select Team</label>
            <select
              name="teamId"
              required
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
            >
              <option value="">-- Choose a Team --</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Member Username</label>
            <input
              type="text"
              name="memberUsername"
              required
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              placeholder="e.g. zoro"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-4 rounded shadow-lg transform transition active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Team List View */}
      <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-6 shadow-xl lg:col-span-2">
        <h2 className="text-2xl font-serif text-ocean-100 mb-6">All Active Crews</h2>
        
        {teams.length === 0 ? (
          <p className="text-ocean-300 italic">No teams exist yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team._id} className="bg-ocean-950/50 p-4 rounded border border-ocean-700 flex flex-col justify-between">
                <div>
                  {editingTeamId === team._id ? (
                    <div className="mb-4">
                      <div className="mb-2">
                        <label className="text-xs text-ocean-300 block mb-1">Team Name</label>
                        <input 
                          type="text" 
                          value={editTeamName}
                          onChange={(e) => setEditTeamName(e.target.value)}
                          className="bg-ocean-900 border border-ocean-600 rounded px-2 py-1 text-sm text-white w-full focus:outline-none"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-ocean-300 block mb-1">Assign Captain</label>
                        <select 
                          value={editCaptainId}
                          onChange={(e) => setEditCaptainId(e.target.value)}
                          className="bg-ocean-900 border border-ocean-600 rounded px-2 py-1 text-sm text-white w-full focus:outline-none"
                        >
                          <option value={team.captainId?._id || ""}>{team.captainId?.username || "None"} (Current)</option>
                          {team.members?.map((m: any) => (
                            <option key={m._id} value={m._id}>{m.username}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateTeam(team._id, team.captainId?._id || "")}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingTeamId(null)}
                          className="bg-wood-600 hover:bg-wood-500 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-treasure-400 truncate">{team.name}</h3>
                      <button 
                        onClick={() => {
                          setEditingTeamId(team._id);
                          setEditTeamName(team.name);
                          setEditCaptainId(team.captainId?._id || "");
                        }}
                        className="text-xs text-ocean-400 hover:text-treasure-300 underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  <div className="text-sm text-ocean-200 mb-2 space-y-1">
                    <p><span className="font-semibold text-ocean-50">Captain:</span> {team.captainId?.username || "Unknown"}</p>
                    <div className="mt-2">
                      <span className="font-semibold text-ocean-50">Crew ({team.members?.length || 0}):</span>
                      {team.members?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {team.members.map((m: any) => (
                            <span key={m._id} className="bg-ocean-800/80 px-2 py-1 rounded text-xs flex items-center gap-1 border border-ocean-600 shadow-sm">
                              {m.username}
                              <button 
                                onClick={() => handleRemoveMember(team._id, m._id, m.username)} 
                                disabled={loading}
                                className="text-red-400 hover:text-red-300 ml-1 bg-red-900/30 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                                title={`Remove ${m.username}`}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-ocean-400 ml-2">None</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-ocean-800/50 flex justify-between items-center text-sm">
                  <span className="text-ocean-300">Score: <strong className="text-treasure-400">{team.score}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
