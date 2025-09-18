import mongoose, { Document, Schema } from "mongoose";

// User interface extending Document
export interface IUser extends Document {
  clerkId: string;
  email: string;
  role: "user" | "org" | "admin";
  projectId?: string;
  organizationName?: string;
  pendingCredit?: number;
  status?: string;
}

// User schema
const CreditSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "org", "admin"],
      default: "user",
      required: true,
    },
    projectId: {
      type: String,
      default: null,
    },
    organizationName: {
      type: String,
      trim: true,
      default: null,
    },
    pendingCredit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Avoid recompiling model in dev/watch mode
export const Credit =
  mongoose.models.User || mongoose.model<IUser>("Credit", CreditSchema);
