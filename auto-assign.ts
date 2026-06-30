import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const envContent = fs.readFileSync(path.join(__dirname, ".env.local"), "utf-8");
let MONGODB_URI = envContent.match(/MONGODB_URI=(.*)/)?.[1]?.trim();
if (MONGODB_URI) {
  MONGODB_URI = MONGODB_URI.replace(/['"]/g, "");
}

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Minimal schemas for the script
const userSchema = new mongoose.Schema({
  username: String,
  role: String,
  teamId: mongoose.Schema.Types.ObjectId,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

const teamSchema = new mongoose.Schema({
  name: String,
  captainId: mongoose.Schema.Types.ObjectId,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  // Read and clean the names
  const membersFile = fs.readFileSync(path.join(__dirname, "members"), "utf-8");
  const rawNames = membersFile.split("\n").filter(line => line.trim() !== "");
  
  const names = rawNames.map(line => {
    // Clean "Name =", "Name - Ask him once", etc.
    return line.split("=")[0].split("-")[0].trim();
  }).filter(n => n.length > 0);

  console.log(`Found ${names.length} valid employee names.`);

  // Shuffle names randomly (Fisher-Yates)
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  // Delete existing users (except admin)
  const deleteRes = await User.deleteMany({ username: { $ne: "admin" } });
  console.log(`Deleted ${deleteRes.deletedCount} existing employees.`);

  // Ensure 11th team exists
  let beastPirates = await Team.findOne({ name: "Beast Pirates" });
  if (!beastPirates) {
    beastPirates = await Team.create({
      name: "Beast Pirates",
      members: [],
      themeData: { 
        primary: "#4c1d95", secondary: "#020617", accent: "#06b6d4",
        appBackground: "radial-gradient(circle at top, #312e81, #020617)",
        panelBackground: "rgba(15, 23, 42, 0.95)",
        borderStyle: "5px ridge #8b5cf6",
        fontFamily: "var(--font-serif)",
        emblemUrl: "/emblems/kaido.png"
      }
    });
  }

  // Get all existing teams
  const teams = await Team.find({});
  if (teams.length === 0) {
    console.error("No teams found in the database. Please seed teams first.");
    process.exit(1);
  }

  console.log(`Found ${teams.length} pirate crews.`);

  // Clear teams
  for (const team of teams) {
    team.captainId = null;
    team.members = [];
    await team.save();
  }

  // Distribute names
  let teamIndex = 0;
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const team = teams[teamIndex];

    const isFirstMember = team.captainId == null;

    const newUser = await User.create({
      username: name,
      role: isFirstMember ? "CAPTAIN" : "MEMBER",
      teamId: team._id,
    });

    if (isFirstMember) {
      team.captainId = newUser._id;
    } else {
      team.members.push(newUser._id);
    }
    
    await team.save();

    // Move to next team, loop back to 0 if we hit the end
    teamIndex = (teamIndex + 1) % teams.length;
  }

  console.log("Teams successfully auto-generated!");
  
  // Show the distribution
  for (const team of teams) {
    const captain = await User.findById(team.captainId);
    const members = await User.find({ _id: { $in: team.members } });
    console.log(`\n🏴‍☠️ ${team.name}`);
    console.log(`   Captain: ${captain?.username}`);
    console.log(`   Crew (${members.length}): ${members.map(m => m.username).join(", ")}`);
  }

  process.exit(0);
}

main().catch(console.error);
