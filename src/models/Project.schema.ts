// ✅ models/Project.ts
import { z } from "zod";

export const createProjectSchema = z.object({
    name: z
        .string({ message: "Project name is required" })
        .min(3, "Project name must be at least 3 characters long"),

    description: z
        .string()
        .max(500, "Description too long")
        .optional(),

    status: z
        .enum(["DRAFT", "READY", "ARCHIVED"])
        .optional()
        .default("DRAFT"),

    userId: z
        .string({ message: "User ID is required" })
        .uuid("Invalid user ID format"),
});

// ✅ Type inference
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
