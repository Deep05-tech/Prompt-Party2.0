import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getDirectImageUrl(url: string) {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (!match) return url;
    return `https://drive.google.com/uc?id=${match[1]}`;
  } catch (error) {
    return url;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !session.user || (role !== "CAPTAIN" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { round, teamId, promptDocUrl, mediaUrl } = await req.json();

    if (!promptDocUrl || !mediaUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if team already submitted for this round
    const existingSubmission = await Submission.findOne({ teamId, round });
    if (existingSubmission) {
      return NextResponse.json({ error: "Your crew has already submitted plunder for this round!" }, { status: 400 });
    }

    // Convert Drive View URL to Direct URL
    const directImageUrl = getDirectImageUrl(mediaUrl);

    // AI Evaluation logic (Visual QC Agent)
    let aiScore = 0;
    let aiFeedback = "";
    
    try {
      const systemPrompt = `You are an expert AI Art Director acting as a QC Agent for an ad film production.
Your task is to grade the provided generated image out of 40 points based on the following criteria:
1. Visual Quality & Photorealism (10 pts)
2. Adherence to Product/Theme (10 pts)
3. Cinematic Aesthetic & Lighting (10 pts)
4. Creativity & Impact (10 pts)

You MUST return ONLY a valid JSON object matching this schema: 
{"score": <number between 0 and 40>, "reason": "<string explaining the score and breakdown>"}

CRITICAL RULES:
- If the image is completely blank, broken, or clearly an error page, you MUST return exactly {"score": 0, "reason": "Invalid or inaccessible image. Ensure Google Drive permissions are set to 'Anyone with the link'."}.
- Do not be overly generous; be a strict, professional art director.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: "text", text: "Evaluate this generated image." },
              { type: "image_url", image_url: { url: directImageUrl, detail: "high" } }
            ] 
          }
        ],
        response_format: { type: "json_object" }
      });
      
      const text = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(text);
      aiScore = parsed.score || 0;
      aiFeedback = parsed.reason || "No reasoning provided by AI.";
    } catch (e: any) {
      console.error("OpenAI grading failed:", e);
      aiFeedback = `AI Grading Failed: ${e.message || "Unknown error"}. Check if image is public.`;
      // We assign 0 if the AI fails (e.g. image is restricted)
      aiScore = 0;
    }

    const submission = await Submission.create({
      round,
      teamId,
      promptDocUrl,
      mediaUrl,
      aiScore,
      aiFeedback,
      totalScore: aiScore // We map aiScore directly to the new Visual score
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
