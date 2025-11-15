import { z } from "zod";

export const createRouteSchema = z.object({
    projectId: z.string().uuid("Invalid project ID"),
    path: z.string().min(1, "Route path is required"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    description: z.string().optional().default(""),
    authRequired: z.boolean().optional(),
    // controllerId: z.string().uuid("Invalid controller ID"),
});
