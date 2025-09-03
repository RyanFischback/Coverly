import { Schema, Document, model, Types } from "mongoose";
import { DateTime, nowUtc, toUtc } from "../types/DateTime";

export interface Resume {
  id: string;
  url: string;
  uploadedAt: DateTime;
  fileName?: string;
  fileType?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  resumes: Resume[];
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

const ResumeSchema = new Schema<Resume>(
  {
    url: { type: String, required: true },
    uploadedAt: {
      type: Date,
      default: () => nowUtc().toDate(),
      get: (val: Date) => toUtc(val),
      set: (val: string | Date) => toUtc(val).toDate(),
    },
    fileName: { type: String },
    fileType: { type: String },
  },
  { _id: true, toJSON: { getters: true } }
);

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    resumes: { type: [ResumeSchema], default: [] },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true, versionKey: false, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

UserSchema.virtual("id").get(function (this: IUser) {
  return (this._id as Types.ObjectId).toHexString();
});

// Transform output
UserSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  getters: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.uploadedAt = ret.uploadedAt?.toISOString();
    ret.createdAt = ret.createdAt?.toISOString();
    ret.updatedAt = ret.updatedAt?.toISOString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
};

export const User = model<IUser>("User", UserSchema);
