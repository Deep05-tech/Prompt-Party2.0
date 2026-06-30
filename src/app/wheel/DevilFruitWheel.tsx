"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

const THEMES = ["Cinematic", "Luxury", "Cyberpunk", "Industrial", "Minimalist", "Vintage", "Fantasy", "Sci-Fi"];
const GENRES = ["Ad Film", "Story", "Promo", "Reel", "Documentary", "Music Video", "Trailer", "Teaser"]; // Shortened some text to fit
const MOODS = ["Energetic", "Melancholy", "Epic", "Mysterious", "Joyful", "Tense", "Whimsical", "Aggressive"];
const VISUAL_STYLES = ["Anime", "Realistic", "Cel-shaded", "Watercolor", "Neon Noir", "Claymation", "Glitch", "Steampunk"];

const WHEELS_DATA = [
  { title: "Theme", items: THEMES },
  { title: "Genre", items: GENRES },
  { title: "Mood", items: MOODS },
  { title: "Visual Style", items: VISUAL_STYLES }
];

function HelmWheel({ title, items, rotation, duration, onSpin, isSpinning, hasResult }: { title: string, items: string[], rotation: number, duration: number, onSpin: () => void, isSpinning: boolean, hasResult: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl md:text-2xl font-serif text-gold mb-10 font-bold tracking-widest uppercase drop-shadow-md z-30">{title}</h3>
      <div className="relative w-56 h-56 md:w-64 md:h-64 xl:w-72 xl:h-72 mb-8">
        
        {/* 8 Wooden Spokes (Handles) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <div 
            key={i}
            className="absolute top-1/2 left-1/2 w-3 md:w-5 h-[120%] bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 border-x-2 border-black/50 shadow-lg rounded-full z-0"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
          >
            {/* Handle Tips */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 shadow-xl border-2 border-amber-900"></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 shadow-xl border-2 border-amber-900"></div>
          </div>
        ))}

        {/* Wheel border/container */}
        <div className="absolute inset-0 rounded-full border-[10px] md:border-[12px] border-[#3e1e04] shadow-[0_0_30px_rgba(245,158,11,0.4),inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden z-10">
          
          <motion.div 
            className="w-full h-full relative"
            animate={{ rotate: rotation }}
            transition={{ duration: duration, ease: [0.1, 0.7, 0.1, 1] }}
          >
            {/* Devil Fruit Slices */}
            <div 
              className="absolute inset-0" 
              style={{ background: 'conic-gradient(from 0deg, #6b21a8 0 45deg, #e11d48 45deg 90deg, #0284c7 90deg 135deg, #d97706 135deg 180deg, #6b21a8 180deg 225deg, #e11d48 225deg 270deg, #0284c7 270deg 315deg, #d97706 315deg 360deg)' }}
            ></div>

            {/* Devil Fruit Swirl Overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, #000 10px), repeating-linear-gradient(#000, #000)' }}
            ></div>
            
            {/* Slice Dividers (Gold) */}
            {[0, 45, 90, 135].map((deg, i) => (
              <div 
                key={`div-${i}`}
                className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-300 via-yellow-600 to-yellow-300"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              ></div>
            ))}

            {/* Text Labels inside Slices */}
            {items.map((item, i) => {
              // Conic starts at 12 o'clock. Slice center is i * 45 + 22.5 deg from 12 o'clock.
              // Standard rotate() 0deg is 3 o'clock.
              // So to point exactly at the slice center:
              const rot = i * 45 + 22.5 - 90;
              return (
                <div 
                  key={`text-${i}`} 
                  className="absolute top-1/2 left-1/2 w-[50%] h-0 flex items-center pl-4 md:pl-6 z-20"
                  style={{ transformOrigin: 'left center', transform: `translateY(-50%) rotate(${rot}deg)` }}
                >
                  <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ transform: 'rotate(0deg)' }}>
                    {item}
                  </span>
                </div>
              );
            })}
            
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#b8860b] rounded-full z-30 shadow-[0_0_20px_rgba(0,0,0,0.8)] border-4 border-[#3e1e04]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-800 rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Compass Pointer Needle */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.6)]">
           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 border-2 border-[#3e1e04] -mb-2 z-10"></div>
           <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[30px] border-t-amber-500"></div>
           <div className="absolute top-5 w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[25px] border-t-yellow-200"></div>
        </div>
      </div>

      <button 
        onClick={onSpin} 
        disabled={isSpinning || hasResult}
        className="mt-6 bg-wood-800 text-gold border-2 border-gold px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-wood-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg z-30 relative"
      >
        {isSpinning ? "Spinning..." : hasResult ? "Locked" : "Spin Helm"}
      </button>
    </div>
  );
}

export default function DevilFruitWheel({ teamId }: { teamId?: string }) {
  const [spinning, setSpinning] = useState([false, false, false, false]);
  const [results, setResults] = useState<(string | null)[]>([null, null, null, null]);
  const [rotations, setRotations] = useState([0, 0, 0, 0]);

  const spinSingle = (index: number) => {
    if (spinning[index] || results[index] !== null) return;

    // Set this wheel to spinning
    setSpinning(prev => {
      const newS = [...prev];
      newS[index] = true;
      return newS;
    });

    const categoryItems = WHEELS_DATA[index].items;
    const randomIdx = Math.floor(Math.random() * categoryItems.length);
    
    // Calculate rotation
    const extraSpins = 5 + index; // stagger base spins
    const targetRot = rotations[index] + (extraSpins * 360) - (randomIdx * 45 + 22.5) - (rotations[index] % 360);
    
    setRotations(prev => {
      const newR = [...prev];
      newR[index] = targetRot;
      return newR;
    });

    const duration = 4 + (index * 0.5);

    setTimeout(async () => {
      setSpinning(prev => {
        const newS = [...prev];
        newS[index] = false;
        return newS;
      });
      setResults(prev => {
        const newRes = [...prev];
        newRes[index] = categoryItems[randomIdx];
        
        // If all results are now populated, fire confetti
        if (newRes.every(r => r !== null)) {
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#FF4500'] });
          
          // Save to database
          const saveResult = async () => {
            try {
              const resultString = newRes.join(" | ");
              await fetch("/api/wheel/spin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ result: resultString }),
              });
            } catch (err) {
              console.error("Failed to save spin result:", err);
            }
          };
          saveResult();
        }
        return newRes;
      });
    }, duration * 1000);
  };

  const spinFleet = () => {
    // Spin any unspun wheels
    results.forEach((res, i) => {
      if (res === null && !spinning[i]) {
        spinSingle(i);
      }
    });
  };

  const allFinished = results.every(r => r !== null);
  const anySpinning = spinning.some(s => s);
  const allLockedOrSpinning = results.every((r, i) => r !== null || spinning[i]);

  return (
    <div className="flex flex-col items-center justify-center max-w-[1600px] mx-auto px-4 overflow-hidden">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-16 mb-16 mt-8 w-full place-items-center">
        {WHEELS_DATA.map((wheel, i) => (
          <HelmWheel 
            key={wheel.title} 
            title={wheel.title} 
            items={wheel.items} 
            rotation={rotations[i]} 
            duration={4 + (i * 0.5)}
            onSpin={() => spinSingle(i)}
            isSpinning={spinning[i]}
            hasResult={results[i] !== null}
          />
        ))}
      </div>

      <button 
        onClick={spinFleet}
        disabled={allLockedOrSpinning}
        className="mb-12 bg-gradient-to-b from-red-600 to-red-800 text-[#fde047] font-bold text-3xl py-6 px-16 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.6)] transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border-4 border-yellow-500"
      >
        {anySpinning ? "Sailing..." : allFinished ? "Fleet Docked" : "SPIN THE FLEET"}
      </button>

      {/* Result Display */}
      {allFinished && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          className="w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-1 max-w-2xl"
        >
          {/* Wanted Poster Background */}
          <div className="bg-[#f4e4bc] w-full h-full p-8 md:p-12 relative overflow-hidden" style={{ border: '2px solid #5a3a22', boxShadow: 'inset 0 0 50px rgba(90,58,34,0.3)' }}>
            
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}></div>

            <div className="text-center border-4 border-[#3e1e04] p-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-[#3e1e04] mb-8 font-black uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>Wanted</h2>
              <div className="w-full h-[2px] bg-[#3e1e04] mb-8"></div>
              
              <h3 className="text-xl font-serif text-[#5a3a22] mb-6 uppercase tracking-widest font-bold">Your Crew's Bounty:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-[#fffdf7] p-4 md:p-6 border-2 border-[#5a3a22] shadow-[4px_4px_0_#5a3a22] transform -rotate-1 flex flex-col justify-center min-h-[100px]">
                  <div className="text-xs md:text-sm text-[#8a5a32] uppercase tracking-widest mb-1 font-bold">Theme</div>
                  <div className="text-xl md:text-2xl font-black text-[#8b0000] uppercase tracking-wider break-words leading-tight">{results[0]}</div>
                </div>
                
                <div className="bg-[#fffdf7] p-4 md:p-6 border-2 border-[#5a3a22] shadow-[4px_4px_0_#5a3a22] transform rotate-1 flex flex-col justify-center min-h-[100px]">
                  <div className="text-xs md:text-sm text-[#8a5a32] uppercase tracking-widest mb-1 font-bold">Genre</div>
                  <div className="text-xl md:text-2xl font-black text-[#8b0000] uppercase tracking-wider break-words leading-tight">{results[1]}</div>
                </div>

                <div className="bg-[#fffdf7] p-4 md:p-6 border-2 border-[#5a3a22] shadow-[4px_4px_0_#5a3a22] transform rotate-1 flex flex-col justify-center min-h-[100px]">
                  <div className="text-xs md:text-sm text-[#8a5a32] uppercase tracking-widest mb-1 font-bold">Mood / Emotion</div>
                  <div className="text-xl md:text-2xl font-black text-[#8b0000] uppercase tracking-wider break-words leading-tight">{results[2]}</div>
                </div>

                <div className="bg-[#fffdf7] p-4 md:p-6 border-2 border-[#5a3a22] shadow-[4px_4px_0_#5a3a22] transform -rotate-1 flex flex-col justify-center min-h-[100px]">
                  <div className="text-xs md:text-sm text-[#8a5a32] uppercase tracking-widest mb-1 font-bold">Visual Style</div>
                  <div className="text-xl md:text-2xl font-black text-[#8b0000] uppercase tracking-wider break-words leading-tight">{results[3]}</div>
                </div>
              </div>

              <div className="w-full h-[2px] bg-[#3e1e04] mb-8"></div>
              
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#3e1e04] hover:text-[#8b0000] transition-colors font-bold text-lg uppercase tracking-wider border-b-2 border-transparent hover:border-[#8b0000]">
                <ArrowLeft size={24} />
                Return to Ship
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
