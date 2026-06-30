import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import dbConnect from "@/lib/db";
import PromptEvaluation from "@/models/PromptEvaluation";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json({ error: "Server configuration error: Gemini API key missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const body = await req.json();
    const { prompt, productMetadata, taskType, context } = body;

    if (!prompt || !taskType) {
      return NextResponse.json({ error: "prompt and taskType are required fields" }, { status: 400 });
    }

    const systemPrompt = `You are an elite AI Prompt Evaluation Engine for a gamified competition called "Prompt Party 2.0".
Your task is to evaluate user-submitted prompts for ${taskType === 'video_generation' ? 'Video Generation (Devil Fruit Challenge)' : 'Image Generation Prompt Battle'}.

EVALUATION CRITERIA:
1. Structure (0-20): Proper formatting, clear instructions, logical flow, organized sections.
2. Clarity (0-15): Easy to understand, no ambiguity, clear instruction to AI model.
3. Product Understanding (0-15): Correct interpretation of the product, relevance to product context, proper focus on product features.
4. Creativity (0-15): Originality of prompt, creative direction, unique instruction style.
5. Technical Detail (0-15): Lighting instructions, scene/environment clarity, composition instructions, camera instructions (for video).
6. Output Control (0-10): Ability of prompt to control AI output, specific constraints included, negative prompts (if any).
7. Task Relevance (0-10): Matches assigned theme/genre, follows challenge requirement.

CRITICAL RULES FOR GRADING:
- If the user prompt is extremely short (e.g., "test", "demo", or under 5 words), or is complete gibberish, you MUST score it as 0 across all categories. The total_score MUST be 0, and the grade MUST be "F".
- Be harsh but fair. A prompt simply saying "a cool car" should score extremely low (under 10/100) because it lacks technical detail, structure, and output control.
- Only highly-detailed, professional AI prompts should score above 80.

Calculate the total_score (0-100) and provide a grade (A, B, C, D, F).

USER PROMPT TO EVALUATE:
"${prompt}"

${productMetadata ? `PRODUCT CONTEXT:\n${JSON.stringify(productMetadata)}` : ''}
${context ? `ADDITIONAL CONTEXT (Theme/Genre/Mood/Style):\n${JSON.stringify(context)}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            total_score: { type: Type.INTEGER, description: "Total score out of 100" },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                structure: { type: Type.INTEGER, description: "Score out of 20" },
                clarity: { type: Type.INTEGER, description: "Score out of 15" },
                product_understanding: { type: Type.INTEGER, description: "Score out of 15" },
                creativity: { type: Type.INTEGER, description: "Score out of 15" },
                technical_detail: { type: Type.INTEGER, description: "Score out of 15" },
                output_control: { type: Type.INTEGER, description: "Score out of 10" },
                task_relevance: { type: Type.INTEGER, description: "Score out of 10" }
              },
              required: ["structure", "clarity", "product_understanding", "creativity", "technical_detail", "output_control", "task_relevance"]
            },
            feedback: { type: Type.STRING, description: "A few sentences of feedback on the prompt" },
            improvements: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 2-4 actionable improvement suggestions"
            },
            grade: { type: Type.STRING, description: "Letter grade A, B, C, D, or F" }
          },
          required: ["total_score", "breakdown", "feedback", "improvements", "grade"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text response generated from Gemini API");
    }

    const evaluationResult = JSON.parse(text);

    // Save to Database
    const evaluation = new PromptEvaluation({
      prompt,
      taskType,
      context: { productMetadata, context },
      totalScore: evaluationResult.total_score,
      breakdown: evaluationResult.breakdown,
      feedback: evaluationResult.feedback,
      improvements: evaluationResult.improvements,
      grade: evaluationResult.grade
    });

    await evaluation.save();

    return NextResponse.json(evaluationResult);

  } catch (error: any) {
    console.error("AI Evaluation Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate evaluation", 
      details: error.message 
    }, { status: 500 });
  }
}
