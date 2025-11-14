import { z } from "zod";

// --- Reusable regex patterns ---
const usernameRegex = /^[a-zA-Z0-9_-]+$/;
const phoneRegex = /^\+?[0-9 ]{10,17}$/;

// --- Zod Schema Definition ---
export const userZodSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(usernameRegex, "Username can only contain letters, numbers, underscores, and dashes")
    .toLowerCase()
    .trim(),

  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z
    .string()
    .email("Invalid email address format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  profilePic: z.object({
    id: z.string().optional().default(""),
    url: z.string().url("Invalid URL").optional().default(""),
  }).default({ id: "", url: "" }),

  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number")
    .optional()
    .default(""),

  bio: z
    .string()
    .max(160, "Bio cannot exceed 160 characters")
    .optional()
    .default(""),

  level: z.number().int().nonnegative().default(1),
  score: z.number().int().nonnegative().default(0),
  maxStreak: z.number().int().nonnegative().default(0),

  currentStreak: z.object({
    value: z.number().int().nonnegative().default(0),
    date: z.preprocess(
      (val) => (val ? new Date(val as string) : new Date()),
      z.date()
    ),
  }).default({ value: 0, date: new Date() }),

  languages: z
    .array(
      z.object({
        name: z.string().trim().optional().default(""),
        questionSolved: z.number().int().nonnegative().default(0),
      })
    )
    .optional()
    .default([]),

  skills: z
    .array(
      z.object({
        name: z.string().trim().optional().default(""),
        questionSolved: z.number().int().nonnegative().default(0),
      })
    )
    .optional()
    .default([]),

  _id: z.string().optional(), // usually handled by MongoDB, but kept for typing
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ✅ Type inference
export type UserZodType = z.infer<typeof userZodSchema>;
