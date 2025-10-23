import { Prisma } from "@prisma/client";

export interface CreateProjectDTO {
    name: string;
    slug: string;
    description?: string;
    status?: "DRAFT" | "READY" | "ARCHIVED"; // optional, defaults to DRAFT
    userId: string; // must come from logged-in user
}


export type ProjectWithRelations = Prisma.ProjectGetPayload<{
    include: {
        models: {
            include: {
                fields: true;
            };
        };
        routes: true;
        services: true;
        controllers: true;
    };
}>;