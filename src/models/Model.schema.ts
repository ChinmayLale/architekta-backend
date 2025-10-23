import { z } from "zod";

export const createModelSchema = z.object({
    name: z.string().min(1, "Model name is required"),
    tableName: z.string().optional(),
    description: z.string().optional(),
    projectId: z.string().uuid("Invalid project ID"),
    positionX: z.number().optional(),
    positionY: z.number().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    hasTimestamps: z.boolean().optional(),

    fields: z
        .array(
            z.object({
                name: z.string().min(1, "Field name is required"),
                type: z.string(),
                isRequired: z.boolean().optional(),
                isUnique: z.boolean().optional(),
                defaultValue: z.string().nullable().optional(),
                enumValues: z.any().optional(),
                validation: z.any().optional(),
                order: z.number().optional(),
            })
        )
        .optional(),

    // 👇 New optional "relations" array
    relations: z
        .array(
            z.object({
                targetModelName: z.string().min(1, "Target model name is required"),
                relationType: z.enum(["ONE_TO_ONE", "ONE_TO_MANY", "MANY_TO_ONE", "MANY_TO_MANY"]),
                relationName: z.string().min(1, "Relation name is required"),
            })
        )
        .optional(),
});
