const mongoose = require("mongoose");

const CREWS = [
  { 
    captain: "luffy", team: "Straw Hat Pirates", 
    theme: { 
      primary: "#dc2626", secondary: "#facc15", accent: "#fde047", 
      appBackground: "linear-gradient(180deg, #0e1e3e 0%, #1e3a8a 100%)", 
      panelBackground: "linear-gradient(135deg, rgba(139, 69, 19, 0.95), rgba(160, 82, 45, 0.85))", 
      borderStyle: "4px solid rgba(250, 204, 21, 0.9)", 
      fontFamily: "var(--font-sans)",
      motifIcon: "Sun",
      motifText: "MUGIWARA",
      animationStyle: "bounce"
    } 
  },
  { 
    captain: "law", team: "Heart Pirates", 
    theme: { 
      primary: "#facc15", secondary: "#1e293b", accent: "#fef08a", 
      appBackground: "radial-gradient(circle at top right, #0f172a 0%, #020617 100%)",
      panelBackground: "rgba(15, 23, 42, 0.95)",
      borderStyle: "2px dashed #facc15",
      fontFamily: "var(--font-sans)",
      motifIcon: "HeartPulse",
      motifText: "HEART",
      animationStyle: "teleport"
    } 
  },
  { 
    captain: "shanks", team: "Red Hair Pirates", 
    theme: { 
      primary: "#991b1b", secondary: "#450a0a", accent: "#fca5a5", 
      appBackground: "linear-gradient(to bottom right, #450a0a, #000000)", 
      panelBackground: "rgba(20, 5, 5, 0.95)",
      borderStyle: "1px solid #fca5a5",
      fontFamily: "var(--font-serif)",
      motifIcon: "Swords",
      motifText: "AKAGAMI",
      animationStyle: "haki"
    } 
  },
  { 
    captain: "whitebeard", team: "Whitebeard Pirates", 
    theme: { 
      primary: "#f8fafc", secondary: "#cbd5e1", accent: "#fbbf24", 
      appBackground: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
      panelBackground: "rgba(15, 23, 42, 0.95)", 
      borderStyle: "4px double #fbbf24",
      fontFamily: "var(--font-serif)",
      motifIcon: "Zap",
      motifText: "SHIROHIGE",
      animationStyle: "quake"
    } 
  },
  { 
    captain: "buggy", team: "Buggy Pirates", 
    theme: { 
      primary: "#ea580c", secondary: "#1d4ed8", accent: "#fde047", 
      appBackground: "repeating-linear-gradient(45deg, #7c2d12, #7c2d12 40px, #451a03 40px, #451a03 80px)",
      panelBackground: "rgba(30, 58, 138, 0.95)",
      borderStyle: "3px dotted #fde047",
      fontFamily: "var(--font-sans)",
      motifIcon: "Star",
      motifText: "BUGGY",
      animationStyle: "split"
    } 
  },
  { 
    captain: "blackbeard", team: "Blackbeard Pirates", 
    theme: { 
      primary: "#020617", secondary: "#4c1d95", accent: "#d8b4fe", 
      appBackground: "radial-gradient(circle at center, #2e1065 0%, #000000 100%)",
      panelBackground: "rgba(5, 5, 5, 0.95)",
      borderStyle: "2px solid #d8b4fe",
      fontFamily: "var(--font-sans)",
      motifIcon: "Moon",
      motifText: "KUROHIGE",
      animationStyle: "void"
    } 
  },
  { 
    captain: "kid", team: "Kid Pirates", 
    theme: { 
      primary: "#7f1d1d", secondary: "#b45309", accent: "#fb923c", 
      appBackground: "linear-gradient(to right, #451a03, #292524, #451a03)",
      panelBackground: "rgba(40, 35, 30, 0.95)",
      borderStyle: "4px groove #fb923c",
      fontFamily: "var(--font-sans)",
      motifIcon: "Magnet",
      motifText: "KID",
      animationStyle: "magnet"
    } 
  },
  { 
    captain: "boa", team: "Kuja Pirates", 
    theme: { 
      primary: "#be185d", secondary: "#831843", accent: "#fbcfe8", 
      appBackground: "linear-gradient(180deg, #831843 0%, #4c0519 100%)",
      panelBackground: "rgba(100, 20, 50, 0.95)", 
      borderStyle: "2px solid #fbcfe8",
      fontFamily: "var(--font-serif)",
      motifIcon: "Flower",
      motifText: "KUJA",
      animationStyle: "slither"
    } 
  },
  { 
    captain: "jinbe", team: "Sun Pirates", 
    theme: { 
      primary: "#0369a1", secondary: "#1e3a8a", accent: "#fde047", 
      appBackground: "radial-gradient(circle at bottom, #0ea5e9, #020617)",
      panelBackground: "rgba(150, 20, 20, 0.95)", 
      borderStyle: "2px solid #fde047",
      fontFamily: "var(--font-sans)",
      motifIcon: "Droplets",
      motifText: "TAIYO",
      animationStyle: "wave"
    } 
  },
  { 
    captain: "roger", team: "Roger Pirates", 
    theme: { 
      primary: "#b45309", secondary: "#78350f", accent: "#fef08a", 
      appBackground: "linear-gradient(to bottom, #78350f, #27272a)",
      panelBackground: "linear-gradient(135deg, rgba(30,30,30,0.95), rgba(10,10,10,0.95))",
      borderStyle: "2px solid #fef08a",
      fontFamily: "var(--font-serif)",
      motifIcon: "Crown",
      motifText: "ROGER",
      animationStyle: "legend"
    } 
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const Team = mongoose.connection.collection("teams");

  for (const crew of CREWS) {
    let team = await Team.findOne({ name: crew.team });
    if (team) {
      await Team.updateOne({ _id: team._id }, { $set: { themeData: crew.theme }, $unset: { "themeData.emblemUrl": "" } });
    }
  }

  console.log("V5 Vector Motif Themes Seeded Locally.");
  process.exit(0);
}

seed().catch(console.error);
