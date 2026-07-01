"use client";

import { useState, useEffect } from "react";
import { Clock, Upload, Anchor, Sun, HeartPulse, Swords, Zap, Star, Moon, Magnet, Flower, Droplets, Crown, CheckCircle } from "lucide-react";
import Link from "next/link";
import SubmissionModal from "@/components/SubmissionModal";
import { motion } from "framer-motion";
import AnimationEngine, { getHoverVariant } from "@/components/AnimationEngine";
import AnimatedBackground from "@/components/AnimatedBackground";

const MotifIcons: Record<string, React.ElementType> = {
  Sun, HeartPulse, Swords, Zap, Star, Moon, Magnet, Flower, Droplets, Crown, Anchor
};

interface DashboardClientProps {
  gameState: any;
  userRole: string;
  teamId?: string;
  hasSubmitted?: boolean;
  wheelResult?: string;
  animationStyle: string;
  motifIcon: string;
  motifText: string;
}

export default function DashboardClient({ 
  gameState, 
  userRole, 
  teamId, 
  hasSubmitted = false,
  wheelResult,
  animationStyle,
  motifIcon,
  motifText
}: DashboardClientProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    if (!gameState.isActive || !gameState.endTime) {
      setTimeLeft("00:00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(gameState.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Time's Up!");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  const MotifIconComponent = MotifIcons[motifIcon] || Anchor;

  // Define continuous animation loops based on the Devil Fruit / power style
  const motifAnimations: any = {
    bounce: { rotate: [0, 360], scale: [1, 1.05, 1], transition: { duration: 10, repeat: Infinity, ease: "linear" } },
    teleport: { scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } },
    haki: { scale: [1, 1.15, 1], opacity: [0.3, 0.8, 0.3], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    quake: { x: [-3, 3, -2, 2, 0], y: [-1, 2, -2, 1, 0], transition: { duration: 0.15, repeat: Infinity, repeatDelay: 1.5 } },
    split: { scale: [1, 0.8, 1], rotate: [0, 180, 360], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    void: { rotate: [360, 0], scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5], transition: { duration: 15, repeat: Infinity, ease: "easeInOut" } },
    magnet: { y: [-15, 15, -15], rotate: [-5, 5, -5], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    slither: { rotate: [-15, 15, -15], scale: [1, 1.05, 1], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    wave: { scaleY: [1, 1.2, 1], y: [0, -10, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    legend: { opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
  };
  const activeMotifAnimation = motifAnimations[animationStyle] || { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } };

  return (
    <>
      <AnimatedBackground animationStyle={animationStyle} />
      {/* Event Concluded Overlay */}
      {gameState.isCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-10 rounded-[2rem] bg-gradient-to-r from-red-900/80 to-purple-900/80 border-2 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-wider uppercase drop-shadow-lg font-serif">
            The Event Has Concluded!
          </h2>
          <p className="text-xl text-red-200 mb-6">
            All pirate crews must return to their ships. The final scores are being tallied.
          </p>
          <Link href="/leaderboard">
            <button className="bg-gradient-to-r from-treasure-600 to-treasure-400 hover:from-treasure-500 hover:to-treasure-300 text-wood-900 font-bold py-4 px-8 rounded-xl shadow-2xl transform transition hover:scale-105 active:scale-95 text-lg">
              View Final Leaderboard
            </button>
          </Link>
        </motion.div>
      )}

      {/* Main Game Interface */}
      <AnimationEngine styleClass={animationStyle}>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4"
        >
          {/* Main Content Area */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
            {/* Round Status */}
        <motion.div 
          whileHover={getHoverVariant(animationStyle)}
          className="backdrop-blur-2xl rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-500"
          style={{ 
            background: 'var(--theme-panel-bg, var(--color-wood-800))',
            border: 'var(--theme-border, 1px solid rgba(255,255,255,0.1))'
          }}
        >
          {/* Glowing Continuous Animated Vector Motif */}
          <motion.div 
            animate={activeMotifAnimation}
            className="absolute top-1/2 right-10 -translate-y-1/2 opacity-[0.15] pointer-events-none z-0"
          >
            <MotifIconComponent size={240} style={{ color: 'var(--color-treasure-400)', filter: 'drop-shadow(0 0 20px var(--color-treasure-400))' }} />
          </motion.div>

          <h2 className="text-2xl mb-4 relative z-10 font-bold" style={{ color: 'var(--color-treasure-400)', fontFamily: 'var(--theme-font, var(--font-serif))' }}>
            Round {gameState.currentRound}: {gameState.currentRound === 1 ? "Prompt Battle" : "Devil Fruit Challenge"}
          </h2>
          
          <div className="flex items-center gap-4 bg-black/20 p-6 rounded-2xl border border-white/5 mb-6">
            <Clock className={`text-${gameState.isActive ? 'green-400' : 'red-400'}`} size={32} />
            <div>
              <p className="text-sm text-ocean-200 uppercase tracking-widest font-semibold">Time Remaining</p>
                <div className="text-3xl lg:text-5xl font-mono text-center mb-0 tracking-widest font-bold" style={{ color: 'var(--color-ocean-100)' }}>
                {timeLeft}
              </div>
            </div>
            <div className="ml-auto">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${gameState.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                {gameState.isActive ? "IN PROGRESS" : "HALTED"}
              </span>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-lg font-bold text-ocean-100">Captain's Orders:</h3>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
              {gameState.currentRound === 1 ? (
                <ul className="list-disc list-inside space-y-2 text-ocean-50">
                  <li>Analyze the provided weak prompt and product image.</li>
                  <li>Improve and structure the prompt.</li>
                  <li>Generate a high-quality image using Gemini AI.</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-ocean-50">
                  <li>Captain must spin the Devil Fruit Wheel to get a Theme and Genre.</li>
                  <li>Generate an AI video using Gemini based on the result.</li>
                </ul>
              )}
            </div>
          </div>
        </motion.div>

          {/* Inputs Display */}
          {gameState.isActive && gameState.inputs && gameState.currentRound === 1 && (
            <motion.div 
              whileHover={getHoverVariant(animationStyle)}
              className="backdrop-blur-2xl rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-500"
              style={{ 
                background: 'var(--theme-panel-bg, var(--color-wood-900))',
                border: 'var(--theme-border, 1px solid rgba(255,255,255,0.1))'
              }}
            >
               <h3 className="text-xl mb-6 relative z-10 font-bold" style={{ color: 'var(--color-treasure-400)', fontFamily: 'var(--theme-font, var(--font-serif))' }}>Mission Intel</h3>
             
             {gameState.inputs.weakPrompt && (
               <div className="mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <p className="text-sm text-ocean-300 uppercase tracking-wide m-0">Weak Prompt</p>
                   <button 
                     onClick={() => navigator.clipboard.writeText(gameState.inputs.weakPrompt)}
                     className="text-xs bg-wood-800 hover:bg-wood-700 text-gold px-3 py-1 rounded-lg border border-gold/30 transition-colors flex items-center gap-1"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                     Copy
                   </button>
                 </div>
                 <div className="bg-black/30 p-6 rounded-2xl border border-white/5 font-mono text-sm text-gray-300">
                   "{gameState.inputs.weakPrompt}"
                 </div>
               </div>
             )}

             {gameState.inputs.productImageUrl && (
               <div>
                 <div className="flex justify-between items-center mb-4">
                   <p className="text-sm text-ocean-300 uppercase tracking-wide m-0">Product Image Reference</p>
                   <a 
                     href={gameState.inputs.productImageUrl}
                     download="reference-image.png"
                     target="_blank"
                     rel="noreferrer"
                     className="text-xs bg-wood-800 hover:bg-wood-700 text-gold px-3 py-1 rounded-lg border border-gold/30 transition-colors flex items-center gap-1"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     Download
                   </a>
                 </div>
                 <img 
                   src={gameState.inputs.productImageUrl} 
                   alt="Product Reference" 
                   className="max-w-full h-auto rounded-2xl border-4 border-white/5 object-cover max-h-64"
                 />
               </div>
             )}
          </motion.div>
        )}
      </motion.div>

      {/* Sidebar / Action Area */}
      <motion.div variants={itemVariants} className="space-y-10">
        {/* Actions */}
        <motion.div 
          whileHover={getHoverVariant(animationStyle)}
          className="backdrop-blur-2xl rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-500"
          style={{ 
            background: 'var(--theme-panel-bg, var(--color-wood-800))',
            border: 'var(--theme-border, 1px solid rgba(255,255,255,0.1))'
          }}
        >
          <motion.div 
            animate={activeMotifAnimation}
            className="absolute top-10 right-10 opacity-[0.1] pointer-events-none z-0"
          >
             <MotifIconComponent size={180} style={{ color: 'var(--color-treasure-400)', filter: 'drop-shadow(0 0 15px var(--color-treasure-400))' }} />
          </motion.div>
          <h3 className="text-xl mb-6 relative z-10 font-bold" style={{ color: 'var(--color-treasure-400)', fontFamily: 'var(--theme-font, var(--font-serif))' }}>Crew Actions</h3>
          
          <div className="space-y-4">
            {gameState.currentRound === 2 ? (
              <div className="w-full h-full p-4 text-center">
                {wheelResult ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-wood-800/80 border-2 border-gold/50 rounded-xl p-4 shadow-xl">
                      <h4 className="text-gold font-serif text-sm uppercase tracking-widest mb-2">Your Round 2 Fate</h4>
                      <p className="text-white font-bold whitespace-pre-wrap leading-relaxed">{wheelResult.replace(/ \| /g, '\n')}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-ocean-300 mb-2 font-serif text-lg">Phase 1: Determine Fate</h4>
                    {userRole === "CAPTAIN" || userRole === "ADMIN" ? (
                      <Link href="/wheel" className="w-full inline-block bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg border border-purple-400/50 transition-all mt-2">
                        Spin the Devil Fruit Wheel
                      </Link>
                    ) : (
                      <p className="text-ocean-200 text-sm mt-4 bg-black/20 p-3 rounded-lg border border-white/5">
                        Waiting for Captain to spin the wheel...
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : null}

            {userRole === "CAPTAIN" || userRole === "ADMIN" ? (
              hasSubmitted ? (
                <div className="w-full flex items-center justify-center gap-2 font-bold py-6 px-4 rounded-2xl shadow-lg border bg-green-900/50 text-green-400 border-green-500/50">
                  <CheckCircle size={20} />
                  Plunder Submitted for Round {gameState.currentRound}!
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: (gameState.isActive && !gameState.isCompleted) ? 1.02 : 1 }}
                  whileTap={{ scale: (gameState.isActive && !gameState.isCompleted) ? 0.98 : 1 }}
                  onClick={() => setIsSubmitModalOpen(true)}
                  disabled={!gameState.isActive || gameState.isCompleted}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-6 px-4 rounded-2xl shadow-lg transition-all border ${
                    (gameState.isActive && !gameState.isCompleted)
                      ? "bg-gradient-to-r from-treasure-600 to-treasure-500 hover:from-treasure-500 hover:to-treasure-400 text-wood-900 border-treasure-400/50"
                      : "bg-black/20 text-ocean-500 border-white/5 cursor-not-allowed"
                  }`}
                >
                  <Upload size={20} />
                  Submit Plunder
                </motion.button>
              )
            ) : (
              <div className="text-center p-6 bg-black/20 rounded-2xl border border-white/5 text-ocean-300 text-sm">
                Only the Captain can submit the final plunder or spin the wheel.
              </div>
            )}
            </div>
          </motion.div>

          {/* Submission Status */}
          <motion.div 
            whileHover={getHoverVariant(animationStyle)}
            className="backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500"
            style={{ 
              background: 'var(--theme-panel-bg, var(--color-wood-900))',
              border: 'var(--theme-border, 1px solid rgba(255,255,255,0.1))'
            }}
          >
          <h3 className="text-xl mb-6 font-bold" style={{ color: 'var(--color-ocean-100)', fontFamily: 'var(--theme-font, var(--font-serif))' }}>Submission Status</h3>
          <div className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5">
            <span className="text-ocean-200">Round {gameState.currentRound}</span>
            {hasSubmitted ? (
              <span className="text-green-500 font-semibold text-sm flex items-center gap-1">
                <CheckCircle size={14} /> Submitted
              </span>
            ) : (
              <span className="text-yellow-500 font-semibold text-sm">Awaiting Submission</span>
            )}
          </div>
        </motion.div>
      </motion.div>

        <SubmissionModal 
          isOpen={isSubmitModalOpen} 
          onClose={() => setIsSubmitModalOpen(false)} 
          currentRound={gameState.currentRound}
          teamId={teamId}
          onSuccess={() => {
            alert("Submission successful! The Fleet Admiral will review your plunder.");
          }}
        />
      </motion.div>
    </AnimationEngine>
    </>
  );
}
