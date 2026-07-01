require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: Missing MONGODB_URI in .env.local file.");
  process.exit(1);
}

const targetFile = process.argv[2];
if (!targetFile) {
  console.error("❌ ERROR: Please provide the path to the links CSV/TXT file.");
  console.log("Usage: node import-drive-links.js drive-links.txt");
  process.exit(1);
}

async function main() {
  let lines = [];
  try {
    const rawData = fs.readFileSync(targetFile, 'utf8');
    lines = rawData.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) {
      throw new Error("No valid lines found in the file.");
    }
  } catch (err) {
    console.error("❌ Failed to read or parse the file:", err.message);
    console.log("Ensure the file is formatted like: Crew Name - https://drive.google.com/drive/folders/XYZ");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const TeamSchema = new mongoose.Schema({ name: String, driveFolderUrl: String }, { strict: false });
  const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Split by the first ' - '
    const splitIndex = line.indexOf(' - ');
    if (splitIndex === -1) {
      console.log(`⚠️ Skipping entry ${i+1}: Invalid format. Missing ' - ' delimiter.`);
      failureCount++;
      continue;
    }

    const crewName = line.slice(0, splitIndex).trim();
    const driveUrl = line.slice(splitIndex + 3).trim();

    if (!crewName || !driveUrl) {
      console.log(`⚠️ Skipping entry ${i+1}: Missing Crew Name or URL.`);
      failureCount++;
      continue;
    }

    try {
      const result = await Team.updateOne(
        { name: new RegExp(`^${crewName}$`, 'i') }, 
        { $set: { driveFolderUrl: driveUrl } }
      );

      if (result.matchedCount === 0) {
        console.log(`❌ Failed to update: Could not find Crew matching "${crewName}"`);
        failureCount++;
      } else {
        console.log(`✅ Updated ${crewName} with folder URL`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ DB Error updating ${crewName}:`, err.message);
      failureCount++;
    }
  }

  console.log("\n--- Import Complete ---");
  console.log(`Successfully Updated: ${successCount} Crews`);
  console.log(`Failed/Skipped: ${failureCount} Crews`);

  await mongoose.disconnect();
}

main();
