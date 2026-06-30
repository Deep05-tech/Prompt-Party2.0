import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const { round, teamId, prompt, promptDocUrl, mediaUrl } = await req.json();

    if (!prompt || !promptDocUrl || !mediaUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Attempt to extract text from Google Doc if provided
    let extractedDocText = null;
    if (promptDocUrl) {
      extractedDocText = await fetchGoogleDocText(promptDocUrl);
    }

    // AI Evaluation logic
    let aiScore = 0;
    try {
      const evaluationPrompt = extractedDocText 
        ? `Evaluate the following prompt details for structure, clarity, completeness, product understanding, instruction quality, and creativity. Score it out of 60. Return ONLY a JSON object with the format {"score": <number>, "reason": "<short reason>"}. 
        
        CRITICAL RULES:
        - If the combined prompt is extremely short (under 5 words), or is complete gibberish like "test" or "demo", you MUST return exactly {"score": 0, "reason": "Invalid or missing prompt"}. Do not give any pity points.

        User Provided Summary: ${prompt}
        Extracted Document Content: ${extractedDocText}`
        : `Evaluate the following prompt for structure, clarity, completeness, product understanding, instruction quality, and creativity. Score it out of 60. Return ONLY a JSON object with the format {"score": <number>, "reason": "<short reason>"}. 
        
        CRITICAL RULES:
        - If the prompt is extremely short (under 5 words), or is complete gibberish like "test" or "demo", you MUST return exactly {"score": 0, "reason": "Invalid or missing prompt"}. Do not give any pity points.

        Prompt: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: evaluationPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "{}";
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      aiScore = parsed.score || 0;
    } catch (e) {
      console.error("Gemini grading failed:", e);
      // Fallback or leave score as 0 for admin to fix
    }

    const submission = await Submission.create({
      round,
      teamId,
      prompt,
      promptDocUrl,
      mediaUrl,
      aiScore,
      totalScore: aiScore // Founder score will be added later
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
