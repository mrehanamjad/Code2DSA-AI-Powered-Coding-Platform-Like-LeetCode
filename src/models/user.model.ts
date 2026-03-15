import mongoose, { Document, model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserI extends Document {
  userName: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: { id: string; url: string };
  phone: string;
  bio: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}



const UserSchema = new Schema<UserI>(
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
      index: true,
    },
    avatar: {
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
      match: /^\+?[0-9 ]{10,17}$/,
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ---------- Indexing ----------
UserSchema.index({ name: 1 });


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
