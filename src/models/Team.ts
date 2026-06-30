import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  captainId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  score: number;
  status: "ACTIVE" | "COMPLETED";
  themeData?: {
    primary: string;
    secondary: string;
    accent: string;
    appBackground: string;
    panelBackground: string;
    borderStyle: string;
    fontFamily: string;
    motifIcon: string;
    motifText: string;
    animationStyle: string;
  };
  wheelResult?: string;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true },
  captainId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  score: { type: Number, default: 0 },
  status: { type: String, enum: ["ACTIVE", "COMPLETED"], default: "ACTIVE" },
  themeData: {
    primary: String,
    secondary: String,
    accent: String,
    appBackground: String,
    panelBackground: String,
    borderStyle: String,
    fontFamily: String,
    motifIcon: String,
    motifText: String,
    animationStyle: String,
  }
});

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
