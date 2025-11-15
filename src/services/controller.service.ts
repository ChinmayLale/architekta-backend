import { prisma } from "../config/db.config";
import { CreateControllerInput } from "../types/controller.types";
import { ApiError } from "../utils/apiError";

export const createControllerService = async (data: CreateControllerInput) => {
    try {
        // 1️⃣ Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: data.projectId },
        });
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        // 2️⃣ Check if model exists (if provided)
        let model = null;
        if (!data.modelId) {
            throw new ApiError(400, "modelId is required to create a controller");
        }
        if (data.modelId) {
            model = await prisma.model.findUnique({
                where: { id: data.modelId },
            });
            if (!model) {
                throw new ApiError(404, "Model not found");
            }
        }

        // 3️⃣ Create controller
        const controller = await prisma.controller.create({
            data: {
                projectId: data.projectId,
                name: data.name,
                filename: data.filename,
                modelId: data.modelId ?? null,
                operationType: data.operationType,
                config: data.config ?? undefined,
            },
            include: {
                model: true,
            }
        });

        return controller;
    } catch (error: any) {
        console.error("❌ Error creating controller:", error);
        throw new Error(error.message || "Failed to create controller");
    }
};
