import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import JudgeClient from "./JudgeClient";

export const dynamic = "force-dynamic";

export default async function JudgePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "FOUNDER") {
    redirect("/dashboard");
  }

  await dbConnect();

  // Fetch all submissions but DO NOT populate team names to ensure blind grading
  const rawSubmissions = await Submission.find().sort({ createdAt: -1 }).lean();
  
  // Clean up submissions for client component
  const submissions = rawSubmissions.map((sub: any, index: number) => ({
    _id: sub._id.toString(),
    submissionNumber: index + 1, // Fake identifier for blind grading
    round: sub.round,
    prompt: sub.prompt, // Pass the text prompt
    mediaUrl: sub.mediaUrl,
    promptDocUrl: sub.promptDocUrl,
    founderScore: sub.founderScore || 0,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-gold mb-2">Founder Judging Panel</h1>
        <p className="text-ocean-200">
          Welcome, {session.user.name}. Grade the submissions based purely on visual output.
          Team names and prompts are completely hidden to ensure fair and unbiased scoring.
        </p>
      </div>

      <JudgeClient submissions={submissions} />
    </div>
  );
}
