import { Route } from "@prisma/client";
import { prisma } from "../config/db.config";

// Extend Route type for creation
export interface CreateRouteInput extends Omit<Route, "id" | "createdAt" | "updatedAt"> {
    controllerId: string;
}

export const createRouteService = async (data: CreateRouteInput) => {
    try {
        const route = await prisma.route.create({
            data: {
                projectId: data.projectId,
                path: data.path,
                method: data.method,
                description: data.description ?? null, // <-- convert undefined to null
                authRequired: data.authRequired ?? false,
                controllerId: data.controllerId,
            },
        });

        return route;
    } catch (error: any) {
        console.error("❌ Error creating route:", error);
        throw new Error(error.message || "Failed to create route");
    }
};
