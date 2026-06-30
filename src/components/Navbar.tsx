"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, Anchor, Users, BookOpen, Trophy, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="shadow-xl sticky top-0 z-50 transition-all duration-500"
      style={{
        background: 'var(--theme-panel-bg, var(--color-wood-800))',
        borderBottom: 'var(--theme-border, 4px solid var(--color-treasure-600))'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                <Anchor className="h-8 w-8 transition-colors" style={{ color: 'var(--color-treasure-400)' }} />
              </motion.div>
              <span 
                className="text-2xl font-bold transition-colors hidden sm:block" 
                style={{ color: 'var(--color-treasure-400)', fontFamily: 'var(--theme-font, var(--font-serif))' }}
              >
                Prompt Party 2.0
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-ocean-800 text-treasure-400 border border-ocean-700"
                  : "text-ocean-100 hover:bg-ocean-800/50 hover:text-treasure-200"
              }`}
            >
              <Anchor className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/teams"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/teams"
                  ? "bg-ocean-800 text-treasure-400 border border-ocean-700"
                  : "text-ocean-100 hover:bg-ocean-800/50 hover:text-treasure-200"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Crews</span>
            </Link>

            <Link
              href="/rules"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/rules"
                  ? "bg-ocean-800 text-treasure-400 border border-ocean-700"
                  : "text-ocean-100 hover:bg-ocean-800/50 hover:text-treasure-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Rules</span>
            </Link>

            {(session?.user as any)?.role === "ADMIN" && (
              <>
                <Link
                  href="/leaderboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/leaderboard"
                      ? "bg-ocean-800 text-treasure-400 border border-ocean-700"
                      : "text-ocean-100 hover:bg-ocean-800/50 hover:text-treasure-200"
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
                
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/admin"
                      ? "bg-red-900/50 text-red-400 border border-red-800"
                      : "text-ocean-100 hover:bg-red-900/30 hover:text-red-300"
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  <span>Fleet Admiral</span>
                </Link>
              </>
            )}
            
            <div className="ml-4 pl-4 border-l border-wood-600 flex items-center gap-4">
              <span className="text-sm text-treasure-200 font-serif">
                {session?.user?.name}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-ocean-300 hover:text-red-400 hover:bg-ocean-900/50 rounded-full transition-colors"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
