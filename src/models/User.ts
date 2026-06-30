import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  role: "ADMIN" | "CAPTAIN" | "MEMBER" | "FOUNDER";
  teamId?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["ADMIN", "CAPTAIN", "MEMBER", "FOUNDER"], default: "MEMBER" },
  teamId: { type: Schema.Types.ObjectId, ref: "Team" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
