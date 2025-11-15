import { z } from "zod";

export const createControllerSchema = z.object({
    projectId: z.string().uuid("Invalid project ID"),
    name: z.string().min(1, "Controller name is required"),
    filename: z.string().min(1, "Filename is required"),
    modelId: z.string().uuid().optional(),
    operationType: z.enum([
        "FIND_ALL",
        "FIND_BY_ID",
        "CREATE",
        "UPDATE",
        "DELETE",
        "FIND_BY_FIELD",
        "SEARCH",
        "COUNT",
        "CUSTOM"
    ]),
    config: z.any().optional(), // optional JSON
});
