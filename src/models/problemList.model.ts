import mongoose, { Document, model, models, Schema } from "mongoose";

export interface ProblemListI extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProblemListSchema = new Schema<ProblemListI>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ---------- Indexing ----------
// Index for querying lists by a specific user
ProblemListSchema.index({ owner: 1 });
// Index for querying public lists
ProblemListSchema.index({ isPublic: 1 });
// Compound index for querying user's lists and sorting/filtering
ProblemListSchema.index({ owner: 1, createdAt: -1 });

const ProblemList = models?.ProblemList || model<ProblemListI>("ProblemList", ProblemListSchema);

export default ProblemList;
