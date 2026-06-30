"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRound: number;
  teamId?: string;
  onSuccess: () => void;
}

export default function SubmissionModal({ isOpen, onClose, currentRound, teamId, onSuccess }: SubmissionModalProps) {
  const [promptText, setPromptText] = useState("");
  const [promptDocUrl, setPromptDocUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round: currentRound,
          teamId,
          prompt: promptText,
          promptDocUrl,
          mediaUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-wood-900 border-2 border-gold rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-wood-700 bg-wood-800">
          <h2 className="text-xl font-serif text-treasure-400">Submit Plunder - Round {currentRound}</h2>
          <button onClick={onClose} className="text-ocean-200 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-ocean-100 text-sm mb-2 uppercase tracking-wide font-semibold">Final Prompt Used</label>
            <textarea
              required
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded px-4 py-3 text-ocean-50 focus:outline-none focus:border-treasure-400 focus:ring-1 focus:ring-treasure-400 min-h-[120px]"
              placeholder="Paste the final prompt that gave you the best result..."
            />
          </div>

          <div>
            <label className="block text-ocean-100 text-sm mb-2 uppercase tracking-wide font-semibold">Prompt Document URL (Google Drive)</label>
            <input
              type="url"
              required
              value={promptDocUrl}
              onChange={(e) => setPromptDocUrl(e.target.value)}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded px-4 py-3 text-ocean-50 focus:outline-none focus:border-treasure-400 focus:ring-1 focus:ring-treasure-400"
              placeholder="https://docs.google.com/..."
            />
            <p className="text-xs text-ocean-400 mt-1">Must include screenshots, attempts, and explanations.</p>
          </div>

          <div>
            <label className="block text-ocean-100 text-sm mb-2 uppercase tracking-wide font-semibold">Generated Media URL (Google Drive)</label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded px-4 py-3 text-ocean-50 focus:outline-none focus:border-treasure-400 focus:ring-1 focus:ring-treasure-400"
              placeholder={currentRound === 1 ? "Link to final image" : "Link to final video"}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded font-semibold text-ocean-200 hover:bg-wood-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-treasure-600 to-treasure-500 hover:from-treasure-500 hover:to-treasure-400 text-wood-900 font-bold py-2 px-6 rounded shadow transform transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Plunder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
