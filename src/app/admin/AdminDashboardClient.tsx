"use client";

import { useState } from "react";
import { updateGameState, addFounderScore, deleteSubmission } from "./actions";

interface AdminDashboardClientProps {
  initialGameState: any;
  submissions: any[];
  teams: any[];
}

export default function AdminDashboardClient({ initialGameState, submissions, teams }: AdminDashboardClientProps) {
  const [gameState, setGameState] = useState(initialGameState);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(30);

  const handleUpdateGameState = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateGameState({
        currentRound: gameState.currentRound,
        isActive: gameState.isActive,
        isCompleted: gameState.isCompleted,
        durationMinutes: duration,
        weakPrompt: gameState.inputs?.weakPrompt || "",
        productImageUrl: gameState.inputs?.productImageUrl || "",
        testCrewId: gameState.testCrewId || undefined
      });
      alert("Game state updated successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScore = async (submissionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const score = parseInt((form.elements.namedItem("score") as HTMLInputElement).value, 10);
    
    if (isNaN(score)) return;

    try {
      await addFounderScore(submissionId, score);
      alert("Score added!");
      // For a better UX, we'd optimistically update the submissions list here.
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission? This cannot be undone.")) return;
    try {
      await deleteSubmission(submissionId);
      alert("Submission deleted!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Game State Control */}
      <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-6 shadow-xl h-fit">
        <h2 className="text-2xl font-serif text-ocean-100 mb-6">Game State Control</h2>
        
        <form onSubmit={handleUpdateGameState} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ocean-300 text-sm mb-2 uppercase">Current Round</label>
              <select
                value={gameState.currentRound}
                onChange={(e) => setGameState({ ...gameState, currentRound: parseInt(e.target.value) })}
                className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              >
                <option value={1}>Round 1: Prompt Battle</option>
                <option value={2}>Round 2: Devil Fruit Video</option>
              </select>
            </div>
            
            <div>
              <label className="block text-ocean-300 text-sm mb-2 uppercase">Status</label>
              <select
                value={gameState.isCompleted ? "completed" : gameState.isActive ? "active" : "inactive"}
                onChange={(e) => {
                  const val = e.target.value;
                  setGameState({
                    ...gameState,
                    isActive: val === "active",
                    isCompleted: val === "completed"
                  });
                }}
                className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              >
                <option value="inactive">Halted</option>
                <option value="active">Active (Timer Running)</option>
                <option value="completed">Event Completed (Lockdown)</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-ocean-300 text-sm mb-2 uppercase">Test Mode Crew (Optional)</label>
              <select
                value={gameState.testCrewId || ""}
                onChange={(e) => setGameState({ ...gameState, testCrewId: e.target.value || null })}
                className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 focus:outline-none focus:border-treasure-400"
              >
                <option value="">-- None (Global State Only) --</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              <p className="text-xs text-ocean-400 mt-1">If selected, ONLY this crew will see the event as Active (even if global status is Halted).</p>
            </div>
          </div>

          {(gameState.isActive || gameState.testCrewId) && (
            <div>
              <label className="block text-ocean-300 text-sm mb-2 uppercase">Timer Duration (Minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50"
              />
            </div>
          )}

          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Weak Prompt (Input)</label>
            <textarea
              value={gameState.inputs?.weakPrompt || ""}
              onChange={(e) => setGameState({ ...gameState, inputs: { ...(gameState.inputs || {}), weakPrompt: e.target.value } })}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50 min-h-[100px]"
              placeholder="e.g. A shoe in a box"
            />
          </div>

          <div>
            <label className="block text-ocean-300 text-sm mb-2 uppercase">Product Image URL</label>
            <input
              type="text"
              value={gameState.inputs?.productImageUrl || ""}
              onChange={(e) => setGameState({ ...gameState, inputs: { ...(gameState.inputs || {}), productImageUrl: e.target.value } })}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded p-3 text-ocean-50"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-4 rounded shadow-lg transform transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Broadcast Orders"}
          </button>
        </form>
      </div>

      {/* Submissions Control */}
      <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-6 shadow-xl h-fit">
        <h2 className="text-2xl font-serif text-ocean-100 mb-6">Plunder Review (Submissions)</h2>
        
        {submissions.length === 0 ? (
          <p className="text-ocean-300 italic">No plunder submitted yet.</p>
        ) : (
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
            {submissions.map((sub) => (
              <div key={sub._id} className="bg-ocean-950/50 p-4 rounded border border-ocean-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-treasure-400">Team: {(sub.teamId as any)?.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-wood-700 px-2 py-1 rounded text-wood-300">Round {sub.round}</span>
                    <button 
                      onClick={() => handleDeleteSubmission(sub._id)}
                      className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/40 border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-ocean-200 mb-2 truncate">
                  <span className="font-semibold">Prompt:</span> {sub.prompt}
                </div>
                
                <div className="flex gap-4 text-xs text-ocean-400 mb-4">
                  <a href={sub.promptDocUrl} target="_blank" rel="noreferrer" className="underline hover:text-ocean-200">View Doc</a>
                  <a href={sub.mediaUrl} target="_blank" rel="noreferrer" className="underline hover:text-ocean-200">View Media</a>
                </div>

                <div className="bg-black/30 p-2 rounded mb-4">
                  <div className="flex justify-between text-sm">
                    <span>AI Score (60%): <strong className="text-ocean-400">{sub.aiScore}/60</strong></span>
                    <span>Founder Score (40%): <strong className="text-green-400">{sub.founderScore}/40</strong></span>
                  </div>
                  
                  {sub.aiFeedback && (
                    <div className="mt-4 p-3 bg-ocean-900/40 rounded-lg border border-ocean-700/50 text-xs text-ocean-200">
                      <strong className="text-ocean-400 block mb-1 uppercase tracking-wider">AI Grading Feedback:</strong>
                      {sub.aiFeedback}
                    </div>
                  )}
                </div>

                {sub.founderScore === 0 && (
                  <form onSubmit={(e) => handleScore(sub._id, e)} className="flex gap-2">
                    <input
                      type="number"
                      name="score"
                      min="0"
                      max="40"
                      required
                      placeholder="Score (0-40)"
                      className="bg-ocean-900 border border-ocean-600 rounded px-2 py-1 text-sm text-white w-24 focus:outline-none"
                    />
                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold transition">
                      Rate
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
