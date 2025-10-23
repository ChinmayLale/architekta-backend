import { Prisma } from "@prisma/client";

export interface CreateModelFieldInput {
    name: string;
    type: string;
    isRequired?: boolean;
    isUnique?: boolean;
    defaultValue?: string | null;
    enumValues?: Prisma.InputJsonValue | null; // 👈 use correct Prisma type
    validation?: Prisma.InputJsonValue | null; // 👈 use correct Prisma type
    order?: number;
}

export interface CreateModelInput {
    name: string;
    tableName?: string;
    description?: string;
    projectId: string;
    positionX?: number;
    positionY?: number;
    icon?: string;
    color?: string;
    hasTimestamps?: boolean;
    fields?: CreateModelFieldInput[];
    relations?: CreateModelRelationInput[]; // 👈 optional relations
}

export interface CreateModelRelationInput {
    targetModelName: string;
    relationType: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE" | "MANY_TO_MANY";
    relationName: string;
}
