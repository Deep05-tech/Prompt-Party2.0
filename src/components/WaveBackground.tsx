"use client";

import { motion } from "framer-motion";

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          x: ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 10,
        }}
        className="absolute bottom-0 w-[200%] h-32 bg-ocean-500/30 rounded-[100%] blur-3xl translate-y-1/2"
      />
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
        className="absolute bottom-10 w-[200%] h-40 bg-ocean-600/40 rounded-[100%] blur-2xl translate-y-1/2"
      />
    </div>
  );
}
