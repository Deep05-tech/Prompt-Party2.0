import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchGoogleDocText(url: string) {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return null;
    const fileId = match[1];
    
    const exportUrl = `https://docs.google.com/document/export?format=txt&id=${fileId}`;
    const response = await fetch(exportUrl);
    
    if (!response.ok) return null;
    
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) return null; // Likely a login redirect or error page
    
    const text = await response.text();
    return text.trim() ? text : null;
  } catch (error) {
    return null;
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

    // Attempt to extract text from Google Doc if provided
    let extractedDocText = null;
    if (promptDocUrl) {
      extractedDocText = await fetchGoogleDocText(promptDocUrl);
    }

    // AI Evaluation logic
    let aiScore = 0;
    let aiFeedback = "";
    try {
      const systemPrompt = "You are an expert AI art director grading a prompt submission for an ad film. You MUST return ONLY a valid JSON object matching this schema: {\"score\": <number between 0 and 60>, \"reason\": \"<string explaining the score>\"}.";
      
      const userPromptText = extractedDocText 
        ? `Evaluate the following prompt details for structure, clarity, completeness, product understanding, instruction quality, and creativity. Score it out of 60.\n\nCRITICAL RULES:\n- If the extracted content is empty or complete gibberish like "test" or "demo", you MUST return exactly {"score": 0, "reason": "Invalid or missing prompt"}. Do not give any pity points.\n\nExtracted Document Content: ${extractedDocText}`
        : `Evaluate the following prompt for structure, clarity, completeness, product understanding, instruction quality, and creativity. Score it out of 60.\n\nCRITICAL RULES:\n- If you cannot extract text from the document, you MUST return exactly {"score": 0, "reason": "Could not extract text from document"}. Do not give any pity points.\n\nPrompt: No text could be extracted.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPromptText }
        ],
        response_format: { type: "json_object" }
      });
      
      const text = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(text);
      aiScore = parsed.score || 0;
      aiFeedback = parsed.reason || "No reasoning provided by AI.";
    } catch (e: any) {
      console.error("OpenAI grading failed:", e);
      aiFeedback = `AI Grading Failed: ${e.message || "Unknown error"}`;
      // Fallback or leave score as 0 for admin to fix
    }

    const submission = await Submission.create({
      round,
      teamId,
      promptDocUrl,
      mediaUrl,
      aiScore,
      aiFeedback,
      totalScore: aiScore // Founder score will be added later
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
