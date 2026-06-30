"use client";

import { useState } from "react";
import { addFounderScore } from "@/app/admin/actions";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle } from "lucide-react";

interface SubmissionProps {
  _id: string;
  submissionNumber: number;
  round: number;
  prompt: string;
  mediaUrl: string;
  promptDocUrl: string;
  founderScore: number;
}

const getPreviewUrl = (url: string) => {
  if (url.includes("drive.google.com") && url.includes("/view")) {
    return url.replace("/view", "/preview");
  }
  return url;
};

export default function JudgeClient({ submissions }: { submissions: SubmissionProps[] }) {
  const [localSubmissions, setLocalSubmissions] = useState(submissions);

  const handleScore = async (submissionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const score = parseInt((form.elements.namedItem("score") as HTMLInputElement).value, 10);
    
    if (isNaN(score)) return;

    try {
      await addFounderScore(submissionId, score);
      
      // Optimistically update local state so they don't have to refresh
      setLocalSubmissions((prev) => 
        prev.map(sub => sub._id === submissionId ? { ...sub, founderScore: score } : sub)
      );
      
      alert("Score saved successfully!");
    } catch (err: any) {
      alert("Error saving score: " + err.message);
    }
  };

  return (
    <div className="bg-wood-800 border-2 border-wood-600 rounded-xl p-8 shadow-xl">
      {localSubmissions.length === 0 ? (
        <p className="text-ocean-300 italic text-center py-10">No submissions have been made yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localSubmissions.map((sub) => (
            <motion.div 
              key={sub._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-ocean-950/50 p-6 rounded-xl border border-ocean-700 shadow-lg flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-treasure-400 font-serif">
                  Submission #{sub.submissionNumber}
                </h3>
                <span className="text-xs bg-wood-700 px-3 py-1 rounded-full text-wood-300 font-bold tracking-widest uppercase">
                  Round {sub.round}
                </span>
              </div>
              
              <div className="flex-grow space-y-4 mb-6">
                <div className="bg-black/40 rounded-lg p-4 border border-ocean-800">
                  <h4 className="text-ocean-400 text-xs uppercase tracking-wider mb-2 font-bold">Best Prompt Used</h4>
                  <p className="text-ocean-100 text-sm whitespace-pre-wrap">{sub.prompt}</p>
                </div>

                <div className="w-full bg-black/50 rounded-lg border border-ocean-800 overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
                  <iframe 
                    src={getPreviewUrl(sub.mediaUrl)} 
                    className="absolute inset-0 w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen"
                    title="Media Preview"
                  ></iframe>
                </div>
                
                <div className="flex gap-2 text-xs">
                  <a href={sub.mediaUrl} target="_blank" rel="noreferrer" className="flex-1 text-center bg-ocean-800 hover:bg-ocean-700 text-white py-2 rounded transition">
                    Open Media Fullscreen
                  </a>
                  <a href={sub.promptDocUrl} target="_blank" rel="noreferrer" className="flex-1 text-center border border-ocean-600 hover:bg-ocean-800 text-ocean-200 py-2 rounded transition">
                    View Google Doc
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-ocean-800">
                {sub.founderScore > 0 ? (
                  <div className="flex items-center justify-between bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
                    <span className="text-green-400 font-semibold flex items-center gap-2">
                      <CheckCircle size={18} /> Graded
                    </span>
                    <span className="text-2xl font-black text-white">{sub.founderScore} <span className="text-sm text-green-400">/ 40</span></span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleScore(sub._id, e)} className="flex items-center gap-3">
                    <div className="flex-grow">
                      <input
                        type="number"
                        name="score"
                        min="0"
                        max="40"
                        required
                        placeholder="Score out of 40"
                        className="w-full bg-black/50 border-2 border-ocean-600 rounded-lg px-4 py-3 text-lg text-white focus:outline-none focus:border-treasure-400"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-treasure-600 to-treasure-500 hover:from-treasure-500 hover:to-treasure-400 text-wood-900 px-6 py-3 rounded-lg font-bold transition transform active:scale-95"
                    >
                      Rate
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
