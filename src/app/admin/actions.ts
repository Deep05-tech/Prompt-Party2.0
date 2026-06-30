"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import GameState from "@/models/GameState";
import Submission from "@/models/Submission";
import Team from "@/models/Team";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateGameState(data: {
  currentRound: number;
  isActive: boolean;
  isCompleted?: boolean;
  durationMinutes: number;
  weakPrompt: string;
  productImageUrl: string;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  let gameState = await GameState.findOne();
  if (!gameState) {
    gameState = new GameState();
  }

  gameState.currentRound = data.currentRound;
  gameState.isActive = data.isActive;
  if (data.isCompleted !== undefined) {
    gameState.isCompleted = data.isCompleted;
  }
  
  if (data.isActive) {
    gameState.startTime = new Date();
    gameState.endTime = new Date(Date.now() + data.durationMinutes * 60000);
  } else {
    gameState.endTime = new Date();
  }

  gameState.inputs = {
    weakPrompt: data.weakPrompt,
    productImageUrl: data.productImageUrl,
  };

  await gameState.save();
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function addFounderScore(submissionId: string, score: number) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  submission.founderScore = score;
  submission.totalScore = (submission.aiScore || 0) + score;
  await submission.save();

  // Update Team Score
  const team = await Team.findById(submission.teamId);
  if (team) {
    // Add total score to team
    team.score = (team.score || 0) + submission.totalScore;
    await team.save();
  }

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/teams");

  return { success: true };
}

export async function createTeam(teamName: string, captainUsername: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const existingTeam = await Team.findOne({ name: teamName });
  if (existingTeam) throw new Error("Team name already exists");

  const existingUser = await User.findOne({ username: captainUsername });
  if (existingUser) throw new Error("Captain username already exists");

  const newUser = await User.create({
    username: captainUsername,
    role: "CAPTAIN",
  });

  const newTeam = await Team.create({
    name: teamName,
    captainId: newUser._id,
    members: [],
  });

  newUser.teamId = newTeam._id;
  await newUser.save();

  revalidatePath("/admin");
  revalidatePath("/teams");
  return { success: true };
}

export async function addMemberToTeam(teamId: string, memberUsername: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  const existingUser = await User.findOne({ username: memberUsername });
  if (existingUser) throw new Error("Member username already exists");

  const newUser = await User.create({
    username: memberUsername,
    role: "MEMBER",
    teamId: team._id,
  });

  team.members.push(newUser._id);
  await team.save();

  revalidatePath("/admin");
  revalidatePath("/teams");
  return { success: true };
}

export async function updateTeam(teamId: string, newName: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const existingTeam = await Team.findOne({ name: newName });
  if (existingTeam && existingTeam._id.toString() !== teamId) {
    throw new Error("Team name already exists");
  }

  await Team.findByIdAndUpdate(teamId, { name: newName });

  revalidatePath("/admin");
  revalidatePath("/teams");
  revalidatePath("/leaderboard");
  return { success: true };
}

export async function assignCaptain(teamId: string, newCaptainId: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  const newCaptain = await User.findById(newCaptainId);
  if (!newCaptain || newCaptain.teamId?.toString() !== teamId) {
    throw new Error("New captain must be a member of the team");
  }

  const oldCaptainId = team.captainId;

  // Update the new captain
  newCaptain.role = "CAPTAIN";
  await newCaptain.save();

  // Downgrade old captain to member if they are not the same
  if (oldCaptainId && oldCaptainId.toString() !== newCaptainId) {
    await User.findByIdAndUpdate(oldCaptainId, { role: "MEMBER" });
  }

  // Set the team's captain
  team.captainId = newCaptain._id;
  await team.save();

  revalidatePath("/admin");
  revalidatePath("/teams");
  return { success: true };
}

export async function removeMemberFromTeam(teamId: string, memberId: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !session.user || role !== "ADMIN") throw new Error("Unauthorized");

  await dbConnect();

  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  // Prevent removing the captain
  if (team.captainId?.toString() === memberId) {
    throw new Error("Cannot remove the captain. Assign a new captain first.");
  }

  // Remove from team members array
  team.members = team.members.filter((id: any) => id.toString() !== memberId);
  await team.save();

  // Clear teamId from User and set role back to MEMBER (if they had a team role)
  // Optionally, we could delete the user entirely if they only exist for this event
  await User.findByIdAndDelete(memberId);

  revalidatePath("/admin");
  revalidatePath("/teams");
  return { success: true };
}
