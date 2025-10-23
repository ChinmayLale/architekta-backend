import { Prisma } from "@prisma/client";
import { prisma } from "../config/db.config";
import { CreateModelInput } from "../types/model.types";



export const createModelService = async (data: CreateModelInput, userID: string) => {
    const {
        name,
        tableName,
        description,
        projectId,
        positionX = 0,
        positionY = 0,
        icon = "database",
        color = "blue",
        hasTimestamps = true,
        fields = [],
        relations = [],
    } = data;

    try {
        // 1️⃣ Create model with fields
        const newModel = await prisma.model.create({
            data: {
                name: `${userID}_${name}`,
                tableName: tableName || name.toLowerCase().replace(/\s+/g, "_"),
                description,
                projectId,
                positionX,
                positionY,
                icon,
                color,
                hasTimestamps,
                fields: {
                    create: fields.map((f) => ({
                        name: f.name,
                        type: f.type as any,
                        isRequired: f.isRequired ?? false,
                        isUnique: f.isUnique ?? false,
                        defaultValue: f.defaultValue ?? null,
                        enumValues: f.enumValues ?? undefined,
                        validation: f.validation ?? undefined,
                        order: f.order ?? 0,
                    })),
                },
            },
            include: { fields: true },
        });

        // 2️⃣ Create relations if any
        if (relations.length > 0) {
            for (const rel of relations) {
                const targetModel = await prisma.model.findFirst({
                    where: { name: { contains: rel.targetModelName }, projectId },
                });

                if (!targetModel) {
                    console.warn(`⚠️ Target model ${rel.targetModelName} not found`);
                    continue;
                }

                await prisma.modelRelation.create({
                    data: {
                        sourceModelId: newModel.id,
                        targetModelId: targetModel.id,
                        relationType: rel.relationType,
                        relationName: rel.relationName,
                    },
                });
            }
        }

        return newModel;
    } catch (error: any) {
        console.error("❌ Error creating model:", error);
        throw new Error(error.message || "Failed to create model");
    }
};

