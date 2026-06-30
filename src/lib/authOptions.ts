import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/models/User";
import Team from "@/models/Team";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        teamName: { label: "Crew Name", type: "text", placeholder: "e.g. Straw Hat Pirates" },
        username: { label: "Full Name", type: "text", placeholder: "e.g. Monkey D. Luffy" },
      },
      async authorize(credentials) {
        if (!credentials?.username) {
          throw new Error("Missing username");
        }

        await dbConnect();
        
        // Admin Override
        if (credentials.username.toLowerCase() === "admin") {
          let adminUser = await User.findOne({ username: "admin" });
          if (!adminUser) {
            adminUser = await User.create({
              username: "admin",
              role: "ADMIN"
            });
          }
          return {
            id: adminUser._id.toString(),
            name: adminUser.username,
            role: adminUser.role,
          };
        }

        // Founder Override
        const usernameLower = credentials.username.toLowerCase();
        if (usernameLower === "pankil" || usernameLower === "vishal") {
          let founderUser = await User.findOne({ username: usernameLower });
          if (!founderUser) {
            founderUser = await User.create({
              username: usernameLower,
              role: "FOUNDER"
            });
          }
          return {
            id: founderUser._id.toString(),
            name: founderUser.username,
            role: founderUser.role,
          };
        }

        if (!credentials.teamName) {
          throw new Error("Missing crew name");
        }

        const team = await Team.findOne({ name: credentials.teamName });
        if (!team) {
          throw new Error("Crew not found. Ask the Fleet Admiral to create it.");
        }

        let user = await User.findOne({ username: credentials.username });
        
        if (!user) {
          // Auto-create user and add to team
          user = await User.create({
            username: credentials.username,
            role: "MEMBER",
            teamId: team._id,
          });
          team.members.push(user._id);
          await team.save();
        } else {
          // Verify user is on this team
          if (user.teamId?.toString() !== team._id.toString()) {
            throw new Error("User belongs to a different crew.");
          }
        }

        let themeData = null;
        if (user.teamId) {
          const team = await Team.findById(user.teamId).lean();
          if (team && (team as any).themeData) {
            themeData = {
              primary: (team as any).themeData.primary,
              secondary: (team as any).themeData.secondary,
              accent: (team as any).themeData.accent,
              appBackground: (team as any).themeData.appBackground,
              panelBackground: (team as any).themeData.panelBackground,
              borderStyle: (team as any).themeData.borderStyle,
              fontFamily: (team as any).themeData.fontFamily,
              motifIcon: (team as any).themeData.motifIcon || "Anchor",
              motifText: (team as any).themeData.motifText || "PIRATES",
              animationStyle: (team as any).themeData.animationStyle || "bounce",
            };
          }
        }

        return {
          id: user._id.toString(),
          name: user.username,
          role: user.role,
          teamId: user.teamId?.toString(),
          themeData,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.teamId = (user as any).teamId;
        token.themeData = (user as any).themeData;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).teamId = token.teamId;
        (session.user as any).themeData = token.themeData;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_secret_for_dev",
};
