import mongoose, { Schema, Document } from "mongoose";

export interface IPromptEvaluation extends Document {
  prompt: string;
  taskType: string;
  context?: any;
  totalScore: number;
  breakdown: {
    structure: number;
    clarity: number;
    product_understanding: number;
    creativity: number;
    technical_detail: number;
    output_control: number;
    task_relevance: number;
  };
  feedback: string;
  improvements: string[];
  grade: string;
  createdAt: Date;
}

const PromptEvaluationSchema = new Schema<IPromptEvaluation>({
  prompt: { type: String, required: true },
  taskType: { type: String, required: true },
  context: { type: Schema.Types.Mixed },
  totalScore: { type: Number, required: true },
  breakdown: {
    structure: { type: Number, required: true },
    clarity: { type: Number, required: true },
    product_understanding: { type: Number, required: true },
    creativity: { type: Number, required: true },
    technical_detail: { type: Number, required: true },
    output_control: { type: Number, required: true },
    task_relevance: { type: Number, required: true }
  },
  feedback: { type: String, required: true },
  improvements: [{ type: String }],
  grade: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PromptEvaluation || mongoose.model<IPromptEvaluation>("PromptEvaluation", PromptEvaluationSchema);
