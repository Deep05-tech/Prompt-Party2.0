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

const teamSchema = new mongoose.Schema({
  name: String,
  themeData: Object,
});
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const res = await Team.updateOne(
    { name: "Beast Pirates" },
    { 
      $set: { 
        themeData: { 
          primary: "#4c1d95", 
          secondary: "#020617", 
          accent: "#06b6d4",
          appBackground: "radial-gradient(circle at top, #312e81, #020617)",
          panelBackground: "rgba(15, 23, 42, 0.95)",
          borderStyle: "5px ridge #8b5cf6",
          fontFamily: "var(--font-serif)",
          emblemUrl: "/emblems/kaido.png"
        } 
      } 
    }
  );

  console.log(`Matched ${res.matchedCount}, Modified ${res.modifiedCount}`);
  process.exit(0);
}

main().catch(console.error);
