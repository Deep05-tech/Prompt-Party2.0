require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

if (!SMTP_EMAIL || !SMTP_PASSWORD) {
  console.error("❌ ERROR: Missing SMTP_EMAIL or SMTP_PASSWORD in .env.local file.");
  console.log("Please add your Gmail address and 16-character App Password to .env.local.");
  process.exit(1);
}

// Ensure the user passes an email argument to test with
const targetEmail = process.argv[2];
if (!targetEmail) {
  console.error("❌ ERROR: Please provide an email address to send the demo to.");
  console.log("Usage: node demo-mailer.js <your-test-email@gmail.com>");
  process.exit(1);
}

// Dummy data for the demo
const participant = {
  name: "Monkey D. Luffy",
  crewName: "Straw Hat Pirates",
  link: "https://prompt-party2-0.vercel.app/"
};

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD
  }
});

const htmlTemplate = `
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

async function main() {
  try {
    console.log(`Sending demo email to ${targetEmail}...`);
    
    const info = await transporter.sendMail({
      from: `"Prompt Party 2.0" <${SMTP_EMAIL}>`,
      to: targetEmail,
      subject: "⚓ Your Prompt Party 2.0 Login Credentials",
      html: htmlTemplate,
    });

    console.log("✅ Demo email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

main();
