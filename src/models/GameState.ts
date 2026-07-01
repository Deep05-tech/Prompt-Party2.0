import mongoose, { Schema, Document } from "mongoose";

export interface IGameState extends Document {
  currentRound: number;
  isActive: boolean;
  isCompleted: boolean;
  startTime?: Date;
  endTime?: Date;
  testCrewId?: string;
  inputs: {
    weakPrompt?: string;
    productImageUrl?: string;
  };
}

const GameStateSchema = new Schema<IGameState>({
  currentRound: { type: Number, default: 1 },
  isActive: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  startTime: { type: Date },
  endTime: { type: Date },
  testCrewId: { type: String },
  inputs: {
    weakPrompt: { type: String },
    productImageUrl: { type: String },
  },
});

export default mongoose.models.GameState || mongoose.model<IGameState>("GameState", GameStateSchema);
