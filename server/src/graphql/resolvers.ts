import { Resolvers } from "./generated";
import { dateScalar } from "./dateScalar";
import { User } from "../models/User";
import { nowUtc } from "../types/DateTime";
import bcrypt from "bcrypt";
import { generateToken } from "../functions/auth";

export const resolvers: Resolvers = {
  DateTime: dateScalar,

  User: {
    id: (parent) => parent.id,
    createdAt: (parent) => parent.createdAt,
    updatedAt: (parent) => parent.updatedAt,
  },

  Resume: {
    id: (parent) => parent.id,
    uploadedAt: (parent) => parent.uploadedAt,
  },

  Query: {
    me: async (_, __, ctx) => {
      if (!ctx.userId) return null;
      return User.findById(ctx.userId);
    },
    allUsers: async () => User.find(),
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, email, passwordHash: hashed });
      await user.save();
      return { token: generateToken(user.id), user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) throw new Error("Invalid credentials");
      return { token: generateToken(user.id), user };
    },
    uploadResume: async (_, { fileUrl, fileName, fileType }, ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized");
      const user = await User.findById(ctx.userId);
      if (!user) throw new Error("User not found");

      user.resumes.push({
        id: crypto.randomUUID(),
        url: fileUrl,
        uploadedAt: nowUtc(),
        fileName: fileName ?? undefined,
        fileType: fileType ?? undefined,
      });
      await user.save();

      return user.resumes[user.resumes.length - 1];
    },
  },
};
