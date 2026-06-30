"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedBackground({ animationStyle }: { animationStyle?: string }) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate static particle arrays on mount so they don't cause hydration mismatch
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      size: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  const style = animationStyle || "bounce";

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {style === "slither" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-pink-300 rounded-bl-full rounded-tr-full opacity-40"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: "-10%" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {style === "wave" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full border border-blue-400/30"
          style={{ width: p.size * 2, height: p.size * 2, left: `${p.left}%`, bottom: "-10%" }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, Math.sin(p.id) * 50, 0],
          }}
          transition={{
            duration: p.duration * 0.8,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {style === "legend" && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-yellow-300 rounded-full opacity-60"
          style={{ width: p.size / 4, height: p.size / 4, left: `${p.left}%`, bottom: "-10%", boxShadow: "0 0 10px #fde047" }}
          animate={{
            y: ["0vh", "-110vh"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration * 0.5,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {style === "teleport" && (
        <div className="absolute inset-0" style={{ 
          backgroundImage: "linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          backgroundPosition: "center center"
        }}>
          <motion.div 
            className="w-full h-[2px] bg-cyan-400/20"
            animate={{ y: ["0vh", "100vh", "0vh"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {style === "haki" && (
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.15)_0%,_transparent_50%)]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {style === "bounce" && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: "repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(250, 204, 21, 0.03) 10deg 20deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {style === "void" && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(88,28,135,0.2) 20%, transparent 60%)" }}
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
