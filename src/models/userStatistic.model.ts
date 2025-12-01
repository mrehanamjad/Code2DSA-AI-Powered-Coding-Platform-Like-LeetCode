import mongoose, { Document, model, models, Schema } from "mongoose";

export interface UserStatisticI extends Document {
  userId: mongoose.Types.ObjectId;
  xp: number;
  score: number;
  level: number;
  maxStreak: number;
  currentStreak: {
    value: number;
    date: Date;
  };
  languages: {
    name: string;
    questionSolved: number;
  }[];
  skills: {
    name: string;
    questionSolved: number;
  }[];
  totalSubmissions: number;
  problemSolved: {
    easy: number;
    medium: number;
    hard: number;
  };
  badge: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserStatisticSchema = new Schema<UserStatisticI>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },
    xp: { type: Number, default: 0 },
    score: { type: Number, default: 0, index: true },
    level: { type: Number, default: 1, index: true },
    maxStreak: { type: Number, default: 0 },
    currentStreak: {
      value: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },
    languages: [
      {
        name: { type: String, trim: true },
        questionSolved: { type: Number, default: 0 },
      },
    ],
    skills: [
      {
        name: { type: String, trim: true },
        questionSolved: { type: Number, default: 0 },
      },
    ],
    problemSolved: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },
    totalSubmissions: { type: Number, default: 0 },
    badge: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// ---------- Indexing ----------
UserStatisticSchema.index({ score: -1 });
UserStatisticSchema.index({ level: -1, score: -1 });
UserStatisticSchema.index({ "skills.name": 1 });
UserStatisticSchema.index({ "languages.name": 1 });
UserStatisticSchema.index({ userId: 1 }); // ensure uniqueness

const UserStatistic =
  models?.UserStatistic ||
  model<UserStatisticI>("UserStatistic", UserStatisticSchema);

export default UserStatistic;
