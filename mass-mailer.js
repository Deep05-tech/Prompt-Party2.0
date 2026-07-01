require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const fs = require('fs');

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

if (!SMTP_EMAIL || !SMTP_PASSWORD) {
  console.error("❌ ERROR: Missing SMTP_EMAIL or SMTP_PASSWORD in .env.local file.");
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error("❌ ERROR: Missing MONGODB_URI in .env.local file.");
  process.exit(1);
}

// Ensure the user passes a file argument
const targetFile = process.argv[2];
if (!targetFile) {
  console.error("❌ ERROR: Please provide the path to the participants JSON file.");
  console.log("Usage: node mass-mailer.js participants.json");
  process.exit(1);
}

const htmlTemplate = (participant) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #e2e8f0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 2px solid #b45309; border-radius: 12px; overflow: hidden; }
    .header { background-color: #450a0a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #f59e0b; }
    .header h1 { margin: 0; color: #fcd34d; font-family: 'Georgia', serif; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 30px; text-align: left; }
    .content h2 { color: #f59e0b; font-size: 22px; margin-top: 0; }
    .content p { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .credentials { background-color: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155; margin: 20px 0; }
    .credentials p { margin: 10px 0; font-size: 18px; }
    .credentials span { color: #fcd34d; font-weight: bold; }
    .button-container { text-align: center; margin-top: 30px; }
    .button { background-color: #b45309; color: #ffffff !important; padding: 15px 30px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; }
    .footer { text-align: center; padding: 20px; font-size: 14px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚓ Prompt Party 2.0 ⚓</h1>
    </div>
    <div class="content">
      <h2>Ahoy, ${participant.name}!</h2>
      <p>Your pirate crew has been assembled, and it's time to set sail into the digital sea. Your official login credentials for Prompt Party 2.0 have been generated.</p>
      
      <div class="credentials">
        <p>Crew Name: <span>${participant.crewName}</span></p>
        <p>Full Name: <span>${participant.name}</span></p>
      </div>
      
      <p style="background-color: #1e293b; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; font-style: italic;">Don't worry if you haven't been practicing your prompt engineering! Prompt Party 2.0 is designed to be a fun, laid-back event. All you need to do is bring your imagination, focus on writing creative descriptions, and let the AI tools do the heavy lifting of generating the images and videos for you. No advanced technical skills or intense preparation are required—just log in, have fun with your crew, and see what kind of wild art you can create!</p>
      
      <p>Use the exact spelling and casing shown above to access your Crew's Dashboard. Only one crew can claim the ultimate bounty.</p>
      
      <div class="button-container">
        <a href="${participant.link}" class="button">Log In Now</a>
      </div>
    </div>
    <div class="footer">
      <p>The Grand Line Awaits.</p>
      <p>&copy; 2026 Prompt Party 2.0</p>
    </div>
  </div>
</body>
</html>
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let participants = [];
  try {
    const rawData = fs.readFileSync(targetFile, 'utf8');
    const lines = rawData.split('\n').filter(l => l.trim().length > 0);
    participants = lines.map(line => {
      const parts = line.split(' - ');
      if (parts.length >= 2) {
        return { name: parts[0].trim(), email: parts[1].trim() };
      }
      return null;
    }).filter(p => p !== null);
    
    if (participants.length === 0) {
      throw new Error("No valid participants found in the file.");
    }
  } catch (err) {
    console.error("❌ Failed to read or parse the file:", err.message);
    console.log("Ensure the file is formatted like: Name - email@example.com");
    process.exit(1);
  }

  // Connect to DB to look up Crew Names
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const UserSchema = new mongoose.Schema({ username: String, teamId: mongoose.Schema.Types.ObjectId }, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const TeamSchema = new mongoose.Schema({ name: String }, { strict: false });
  const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

  // Fetch all users and teams for fast memory lookup
  const allUsers = await User.find({}).lean();
  const allTeams = await Team.find({}).lean();
  
  const teamMap = {};
  allTeams.forEach(t => teamMap[t._id.toString()] = t.name);

  const userMap = {};
  allUsers.forEach(u => {
    if (u.teamId) {
      userMap[u.username.trim().toLowerCase()] = teamMap[u.teamId.toString()];
    }
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD
    }
  });

  console.log(`Found ${participants.length} participants in the file.`);
  console.log("Starting Mass Mailer...\\n");

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    
    if (!p.name || !p.email) {
      console.log(`⚠️ Skipping entry ${i+1}: Missing name or email.`);
      failureCount++;
      continue;
    }

    const cleanName = p.name.trim();
    const crewName = userMap[cleanName.toLowerCase()];

    if (!crewName) {
      console.log(`❌ Skipping ${cleanName}: Could not find them assigned to a Crew in the database.`);
      failureCount++;
      continue;
    }

    const mailData = {
      name: cleanName,
      crewName: crewName,
      link: "https://prompt-party2-0.vercel.app/"
    };

    try {
      await transporter.sendMail({
        from: `"Prompt Party 2.0" <${SMTP_EMAIL}>`,
        to: p.email,
        subject: "⚓ Your Prompt Party 2.0 Login Credentials",
        html: htmlTemplate(mailData),
      });
      console.log(`✅ Sent email to ${cleanName} (${crewName}) at ${p.email}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to send email to ${cleanName}: `, err.message);
      failureCount++;
    }

    // Delay 2 seconds between emails to avoid getting flagged for spam by Gmail
    if (i < participants.length - 1) {
      await delay(2000);
    }
  }

  console.log("\\n--- Mailing Complete ---");
  console.log(`Total Successful: ${successCount}`);
  console.log(`Total Failed: ${failureCount}`);

  await mongoose.disconnect();
}

main();
