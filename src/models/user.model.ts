import mongoose, { Document, model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserI {
  userName: string;
  name: string;
  email: string;
  password: string;
  profilePic: { id: string; url: string };
  phone: string;
  bio: string;
  level: number;
  score: number;
  maxStreak: number;
  currentStreak: {
    value: number;
    date: Date;
  };
  languages: [{
    name: string;
    questionSolved: number;
  }];
  skills: [{
    name: string;
    questionSolved: number;
  }];
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<UserI & Document>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      url: {
        type: String,
        default: "",
      },
      id: {
        type: String,
        default: "",
      },
    },
    phone: {
      type: String,
      required: false,
      default: "",
      match:/^\+?[0-9 ]{10,17}$/,
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
     // ---------- Performance / XP / Level System ----------
    level: { type: Number, default: 1, index: true }, // 🔍 Useful for leaderboard
    score: { type: Number, default: 0, index: true }, // 🔍 Leaderboard queries
    maxStreak: { type: Number, default: 0 },
    currentStreak: {
      value: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },

    // ---------- Solved Stats ----------
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
  },
  {
    timestamps: true,
  }
);

// ---------- Indexing ----------
UserSchema.index({ userName: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ name: 1 });
UserSchema.index({ score: -1 }); // Fast sorting for leaderboards
UserSchema.index({ level: -1, score: -1 }); // Compound index for leaderboard rank
UserSchema.index({ "skills.name": 1 }); // For filtering/search by skill
UserSchema.index({ "languages.name": 1 }); // For filtering/search by language

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // we creating account/password first time then we have to hash the password
  // here this is  if we edit the password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<UserI>("User", UserSchema);
/*
  As nextJs works on edge so most of the time 
  it can't understand that
  is it connecting first time to mongodb or not
  so check if model already exists then give its reference 
  otherwise create model
*/
export default User;