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
  score: Number,
});
const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

const submissionSchema = new mongoose.Schema({ teamId: mongoose.Schema.Types.ObjectId });
const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);

const evalSchema = new mongoose.Schema({ teamId: mongoose.Schema.Types.ObjectId });
const PromptEvaluation = mongoose.models.PromptEvaluation || mongoose.model("PromptEvaluation", evalSchema);

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const teamRes = await Team.updateMany({}, { $set: { score: 0 } });
  console.log(`Reset score for ${teamRes.modifiedCount} teams to 0.`);

  const subRes = await Submission.deleteMany({});
  console.log(`Deleted ${subRes.deletedCount} submissions.`);

  const evalRes = await PromptEvaluation.deleteMany({});
  console.log(`Deleted ${evalRes.deletedCount} prompt evaluations.`);

  process.exit(0);
}

main().catch(console.error);
