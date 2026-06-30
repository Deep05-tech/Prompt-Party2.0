import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  round: number;
  teamId: mongoose.Types.ObjectId;
  prompt: string;
  promptDocUrl: string; // Google Drive link
  mediaUrl: string; // Final Image/Video link
  aiScore?: number;
  founderScore?: number;
  totalScore?: number;
}

const SubmissionSchema = new Schema<ISubmission>({
  round: { type: Number, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  prompt: { type: String, required: true },
  promptDocUrl: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  aiScore: { type: Number, default: 0 },
  founderScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
});

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
