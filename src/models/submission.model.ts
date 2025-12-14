import mongoose, { Schema, Document, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface SubmissionI extends Document {
  _id: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  totalTestCases: number;
  passedTestCases: number;
  status:
    | "accepted"
    | "wrongAnswer"
    | "runtimeError"
    | "compileError"
    | "tle";
  lastFailedTestCase?: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  } | null;
  error?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const FailedTestCaseSchema = new Schema(
  {
    input: String,
    expectedOutput: String,
    actualOutput: String,
    error: { type: String, default: null },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<SubmissionI>(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Problem",
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    code: { type: String, required: true },
    language: {
      type: String,
      required: true,
      enum: [
        "javascript",
        "typescript",
        "python",
        "java",
        "cpp",
        "c",
        "csharp",
        "go",
        "rust",
        "ruby",
        "php",
        "swift",
        "kotlin",
      ],
    },
    totalTestCases: { type: Number, required: true },
    passedTestCases: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["accepted", "wrongAnswer", "runtimeError", "compileError", "tle"],
      index: true,
    },
    error: { type: String, default: null },
    lastFailedTestCase: {
      type: FailedTestCaseSchema,
      default: null,
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound Index: userId + problemId
SubmissionSchema.index({ userId: 1, problemId: 1 });

SubmissionSchema.plugin(aggregatePaginate);


const Submission =
  models.Submission ||
  mongoose.model<SubmissionI>("Submission", SubmissionSchema);

export default Submission;
