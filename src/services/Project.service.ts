import { Project } from "@prisma/client";
import { prisma } from "../config/db.config";
import { CreateProjectDTO, ProjectWithRelations } from "../types/project.type";


const createProjectService = async (data: CreateProjectDTO): Promise<Project> => {
    if (!data.name || !data.userId) {
        throw new Error("Project name and ownerId are required");
    }
    const project = await prisma.project.create({
        data: {
            name: data.name,
            description: data.description || "",
            userId: data.userId,
            slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
        }
    });

    if (!project) {
        throw new Error("Failed to create project");
    }

    return project;
}


const getProjectByIdService = async (projectId: string, userId: string): Promise<ProjectWithRelations | null> => {
    if (!projectId || !userId) {
        throw new Error("Project ID and User ID are required");
    }
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId: userId
        },
        include: {
            models: {
                include: {
                    fields: true,
                    sourceRelations: {
                        include:{
                            targetModel: true
                        }
                    },
                    targetRelations: true
                }
            },
            routes: true,
            services: true,
            controllers: true,

        }
    });
    if (!project) {
        throw new Error("Project not found or access denied");
    }
    return project;
}



export const ProjectService = {
    createProjectService,
    getProjectByIdService
};