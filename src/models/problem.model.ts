import mongoose, { Schema, Document, models, Model } from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

// --- Interfaces ---
interface ExampleI {
  input: string;
  output: string;
  explanation?: string;
}

interface StarterCodeI {
  javascript: string;
  typescript: string;
  python: string;
  java: string;
  cpp: string;
  c: string;
  csharp: string;
  go: string;
  rust: string;
  ruby: string;
  php: string;
  swift: string;
  kotlin: string;
}

interface FunctionI {
  name: string;
  params: string[];
}

export interface ProblemI extends Document {
  problemId: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string[];
  status: "Not Started" | "In Progress" | "Completed";
  function: FunctionI;
  description: string;
  examples: ExampleI[];
  constraints: string[];
  starterCode: StarterCodeI;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schemas ---
const ExampleSchema: Schema<ExampleI> = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const StarterCodeSchema: Schema<StarterCodeI> = new Schema(
  {
    javascript: { type: String, required: true },
    typescript: { type: String, required: true },
    python: { type: String, required: true },
    java: { type: String, required: true },
    cpp: { type: String, required: true },
    c: { type: String, required: true },
    csharp: { type: String, required: true },
    go: { type: String, required: true },
    rust: { type: String, required: true },
    ruby: { type: String, required: true },
    php: { type: String, required: true },
    swift: { type: String, required: true },
    kotlin: { type: String, required: true },
  },
  { _id: false }
);

const FunctionSchema: Schema<FunctionI> = new Schema(
  {
    name: { type: String, required: true },
    params: { type: [String], required: true },
  },
  { _id: false }
);

const ProblemSchema: Schema<ProblemI> = new Schema(
  {
    problemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: { type: [String], required: true },
    function: { type: FunctionSchema, required: true },
    description: { type: String, required: true },
    examples: { type: [ExampleSchema], required: true },
    constraints: { type: [String], required: true },
    starterCode: { type: StarterCodeSchema, required: true },
  },
  { timestamps: true }
);

ProblemSchema.plugin(aggregatePaginate);

// Define the AggregatePaginateModel type
interface ProblemModel<T extends Document> extends Model<T> {
    aggregatePaginate: any;
}

const Problem = (models.Problem || mongoose.model<ProblemI>("Problem", ProblemSchema)) as ProblemModel<ProblemI>;

export default Problem;