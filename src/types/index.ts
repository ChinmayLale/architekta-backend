// =============================
// ENUMS
// =============================

export enum Provider {
    GOOGLE = "GOOGLE",
    EMAIL = "EMAIL",
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export enum ProjectStatus {
    DRAFT = "DRAFT",
    READY = "READY",
    ARCHIVED = "ARCHIVED",
}

export enum RelationType {
    ONE_TO_ONE = "ONE_TO_ONE",
    ONE_TO_MANY = "ONE_TO_MANY",
    MANY_TO_ONE = "MANY_TO_ONE",
    MANY_TO_MANY = "MANY_TO_MANY",
}

export enum FieldType {
    STRING = "STRING",
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME",
    EMAIL = "EMAIL",
    UUID = "UUID",
    JSON = "JSON",
    ENUM = "ENUM",
}

export enum OperationType {
    FIND_ALL = "FIND_ALL",
    FIND_BY_ID = "FIND_BY_ID",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    FIND_BY_FIELD = "FIND_BY_FIELD",
    SEARCH = "SEARCH",
    COUNT = "COUNT",
    CUSTOM = "CUSTOM",
}

// =============================
// MODELS (TypeScript interfaces)
// =============================

export interface User {
    id: string;
    displayName: string;
    email: string;
    provider: Provider;
    passwordHash?: string | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;

    projects?: Project[];
    sessions?: Session[];
}




export interface Session {
    id: string;
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;

    user?: User;
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    status: ProjectStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;

    user?: User;
    models?: Model[];
    routes?: Route[];
    controllers?: Controller[];
    services?: Service[];
}

export interface Model {
    id: string;
    name: string;
    tableName: string;
    description?: string | null;
    projectId: string;
    positionX: number;
    positionY: number;
    icon: string;
    color: string;
    hasTimestamps: boolean;
    createdAt: Date;
    updatedAt: Date;

    project?: Project;
    fields?: ModelField[];
    sourceRelations?: ModelRelation[];
    targetRelations?: ModelRelation[];
    controllers?: Controller[];
    services?: Service[];
}

export interface ModelField {
    id: string;
    modelId: string;
    name: string;
    type: FieldType;
    isRequired: boolean;
    isUnique: boolean;
    defaultValue?: string | null;
    enumValues?: any;
    validation?: any;
    order: number;
    createdAt: Date;

    model?: Model;
}

export interface ModelRelation {
    id: string;
    sourceModelId: string;
    targetModelId: string;
    relationType: RelationType;
    relationName: string;
    sourceForeignKey?: string | null;
    junctionTable?: string | null;
    createdAt: Date;

    sourceModel?: Model;
    targetModel?: Model;
}

export interface Controller {
    id: string;
    projectId: string;
    name: string;
    filename: string;
    modelId?: string | null;
    operationType: OperationType;
    customLogic?: string | null;
    config?: any;
    createdAt: Date;
    updatedAt: Date;

    project?: Project;
    model?: Model;
    route?: Route;
}

export interface Service {
    id: string;
    projectId: string;
    name: string;
    filename: string;
    modelId?: string | null;
    operations: any;
    customMethods?: any;
    createdAt: Date;

    project?: Project;
    model?: Model;
}

export interface Route {
    id: string;
    projectId: string;
    path: string;
    method: HttpMethod;
    description?: string | null;
    authRequired: boolean;
    controllerId: string;
    createdAt: Date;
    updatedAt: Date;

    project?: Project;
    controller?: Controller;
}
