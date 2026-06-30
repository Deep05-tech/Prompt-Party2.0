"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WaveBackground from "@/components/WaveBackground";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const } }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      teamName,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. The Fleet Admiral rejects you.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ocean-950">
      <WaveBackground />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-wood-800/90 backdrop-blur-md p-8 rounded-xl border border-gold shadow-2xl max-w-md w-full mx-4 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-6xl mb-4 inline-block"
          >
            🏴‍☠️
          </motion.div>
          <h1 className="text-4xl text-gold font-serif mt-4 mb-2">Prompt Party 2.0</h1>
          <p className="text-ocean-200 font-light italic">Entering the Grand Line...</p>
        </motion.div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-ocean-100 text-sm mb-2 uppercase tracking-wider font-semibold">Crew Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded px-4 py-3 text-ocean-50 focus:outline-none focus:border-treasure-400 focus:ring-1 focus:ring-treasure-400 transition-all placeholder:text-ocean-700"
              placeholder="e.g. Straw Hat Pirates"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-ocean-100 text-sm mb-2 uppercase tracking-wider font-semibold">Full Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-ocean-950/50 border border-ocean-700 rounded px-4 py-3 text-ocean-50 focus:outline-none focus:border-treasure-400 focus:ring-1 focus:ring-treasure-400 transition-all placeholder:text-ocean-700"
              placeholder="e.g. Monkey D. Luffy"
              required
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-treasure-600 to-treasure-500 hover:from-treasure-500 hover:to-treasure-400 text-wood-900 font-bold py-3 px-4 rounded shadow-lg transform transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Boarding..." : "Set Sail"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
