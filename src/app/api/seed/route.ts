import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Team from "@/models/Team";

const CREWS = [
  { 
    captain: "luffy", team: "Straw Hat Pirates", 
    theme: { 
      primary: "#dc2626", secondary: "#facc15", accent: "#fbbf24",
      appBackground: "linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)", // Ocean sky
      panelBackground: "rgba(139, 90, 43, 0.9)", // Warm wood
      borderStyle: "4px solid #facc15", // Solid gold
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/luffy.png"
    } 
  },
  { 
    captain: "law", team: "Heart Pirates", 
    theme: { 
      primary: "#facc15", secondary: "#1e293b", accent: "#cbd5e1",
      appBackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Dark submarine
      panelBackground: "rgba(30, 41, 59, 0.95)", // Metallic dark blue
      borderStyle: "3px dashed #facc15", // Dashed yellow
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/law.png"
    } 
  },
  { 
    captain: "shanks", team: "Red Hair Pirates", 
    theme: { 
      primary: "#991b1b", secondary: "#450a0a", accent: "#ef4444",
      appBackground: "radial-gradient(circle at center, #7f1d1d 0%, #450a0a 100%)", // Crimson
      panelBackground: "rgba(10, 10, 10, 0.9)", // Black wood
      borderStyle: "2px solid #ef4444", // Thin red
      fontFamily: "var(--font-serif)",
      emblemUrl: "/emblems/shanks.png"
    } 
  },
  { 
    captain: "whitebeard", team: "Whitebeard Pirates", 
    theme: { 
      primary: "#f8fafc", secondary: "#cbd5e1", accent: "#fbbf24",
      appBackground: "linear-gradient(to right, #0f172a, #334155, #0f172a)", // Navy blue
      panelBackground: "rgba(255, 255, 255, 0.95)", // White marble
      borderStyle: "5px double #facc15", // Royal gold
      fontFamily: "var(--font-serif)",
      emblemUrl: "/emblems/whitebeard.png"
    } 
  },
  { 
    captain: "buggy", team: "Buggy Pirates", 
    theme: { 
      primary: "#ea580c", secondary: "#1d4ed8", accent: "#ef4444",
      appBackground: "repeating-radial-gradient(circle at center, #ea580c, #ea580c 20px, #b45309 20px, #b45309 40px)", // Crazy circus tent
      panelBackground: "rgba(30, 58, 138, 0.95)", // Deep blue
      borderStyle: "4px dotted #ef4444", // Clown dots
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/buggy.png"
    } 
  },
  { 
    captain: "blackbeard", team: "Blackbeard Pirates", 
    theme: { 
      primary: "#020617", secondary: "#4c1d95", accent: "#7e22ce",
      appBackground: "linear-gradient(to bottom, #000000, #2e1065)", // Void purple
      panelBackground: "rgba(0, 0, 0, 0.8)", // Pure darkness
      borderStyle: "3px solid #7e22ce", // Purple glow
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/blackbeard.png"
    } 
  },
  { 
    captain: "kid", team: "Kid Pirates", 
    theme: { 
      primary: "#7f1d1d", secondary: "#b45309", accent: "#d97706",
      appBackground: "linear-gradient(45deg, #1c1917, #451a03)", // Rust
      panelBackground: "rgba(28, 25, 23, 0.95)", // Heavy metal
      borderStyle: "6px groove #b45309", // Thick copper
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/kid.png"
    } 
  },
  { 
    captain: "boa", team: "Kuja Pirates", 
    theme: { 
      primary: "#be185d", secondary: "#831843", accent: "#fbcfe8",
      appBackground: "linear-gradient(135deg, #831843, #be185d)", // Elegant pink/red
      panelBackground: "rgba(251, 207, 232, 0.9)", // Soft pink glass
      borderStyle: "3px solid #f9a8d4", // Pink accent
      fontFamily: "var(--font-serif)",
      emblemUrl: "/emblems/boa.png"
    } 
  },
  { 
    captain: "jinbe", team: "Sun Pirates", 
    theme: { 
      primary: "#0369a1", secondary: "#1e3a8a", accent: "#ef4444",
      appBackground: "linear-gradient(to bottom, #0284c7, #0c4a6e)", // Deep ocean
      panelBackground: "rgba(239, 68, 68, 0.85)", // Red sun
      borderStyle: "4px solid #facc15", // Sun rays
      fontFamily: "var(--font-sans)",
      emblemUrl: "/emblems/jinbe.png"
    } 
  },
  { 
    captain: "roger", team: "Roger Pirates", 
    theme: { 
      primary: "#b45309", secondary: "#78350f", accent: "#fef08a",
      appBackground: "radial-gradient(circle at top, #78350f, #000000)", // Legendary dark gold
      panelBackground: "rgba(20, 20, 20, 0.95)", // Black polished wood
      borderStyle: "3px solid #facc15", // Solid gold
      fontFamily: "var(--font-serif)",
      emblemUrl: "/emblems/roger.png"
  },
  { 
    captain: "kaido", team: "Beast Pirates", 
    theme: { 
      primary: "#4c1d95", secondary: "#020617", accent: "#06b6d4",
      appBackground: "radial-gradient(circle at top, #312e81, #020617)", // Ominous dragon aura
      panelBackground: "rgba(15, 23, 42, 0.95)", // Slate dark
      borderStyle: "5px ridge #8b5cf6", // Purple dragon scales
      fontFamily: "var(--font-serif)",
      emblemUrl: "/emblems/kaido.png"
    } 
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    for (const crew of CREWS) {
      // Create or find Captain User
      let captain = await User.findOne({ username: crew.captain });
      if (!captain) {
        captain = await User.create({
          username: crew.captain,
          role: "CAPTAIN",
        });
      }

      // Create or find Team
      let team = await Team.findOne({ name: crew.team });
      if (!team) {
        team = await Team.create({
          name: crew.team,
          captainId: captain._id,
          members: [],
          themeData: crew.theme
        });
      } else {
        team.themeData = crew.theme;
        team.captainId = captain._id;
        await team.save();
      }

      // Always update captain's teamId
      captain.teamId = team._id;
      await captain.save();
    }

    // Ensure Admin exists
    let admin = await User.findOne({ username: "admin" });
    if (!admin) {
      await User.create({
        username: "admin",
        role: "ADMIN",
      });
    }

    return NextResponse.json({ success: true, message: "Deep Themes Seeded Successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
