-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('FIND_ALL', 'FIND_BY_ID', 'CREATE', 'UPDATE', 'DELETE', 'FIND_BY_FIELD', 'SEARCH', 'COUNT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('STRING', 'TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'DATETIME', 'EMAIL', 'UUID', 'JSON', 'ENUM');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'READY', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'EMAIL');

-- CreateTable
CREATE TABLE "controllers" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "filename" VARCHAR(100) NOT NULL,
    "modelId" TEXT,
    "operationType" "OperationType" NOT NULL,
    "customLogic" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "controllers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tableName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL DEFAULT 0,
    "positionY" INTEGER NOT NULL DEFAULT 0,
    "icon" VARCHAR(50) NOT NULL DEFAULT 'database',
    "color" VARCHAR(20) NOT NULL DEFAULT 'blue',
    "hasTimestamps" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_fields" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "FieldType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isUnique" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" TEXT,
    "enumValues" JSONB,
    "validation" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_relations" (
    "id" TEXT NOT NULL,
    "sourceModelId" TEXT NOT NULL,
    "targetModelId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "relationName" VARCHAR(100) NOT NULL,
    "sourceForeignKey" VARCHAR(100),
    "junctionTable" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "description" TEXT,
    "authRequired" BOOLEAN NOT NULL DEFAULT false,
    "controllerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "filename" VARCHAR(100) NOT NULL,
    "modelId" TEXT,
    "operations" JSONB NOT NULL,
    "customMethods" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'EMAIL',
    "passwordHash" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "controllers_projectId_idx" ON "controllers"("projectId");

-- CreateIndex
CREATE INDEX "controllers_modelId_idx" ON "controllers"("modelId");

-- CreateIndex
CREATE INDEX "models_projectId_idx" ON "models"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "models_projectId_name_key" ON "models"("projectId", "name");

-- CreateIndex
CREATE INDEX "model_fields_modelId_idx" ON "model_fields"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "model_fields_modelId_name_key" ON "model_fields"("modelId", "name");

-- CreateIndex
CREATE INDEX "model_relations_sourceModelId_idx" ON "model_relations"("sourceModelId");

-- CreateIndex
CREATE INDEX "model_relations_targetModelId_idx" ON "model_relations"("targetModelId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "routes_controllerId_key" ON "routes"("controllerId");

-- CreateIndex
CREATE INDEX "routes_projectId_idx" ON "routes"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "routes_projectId_path_method_key" ON "routes"("projectId", "path", "method");

-- CreateIndex
CREATE INDEX "services_projectId_idx" ON "services"("projectId");

-- CreateIndex
CREATE INDEX "services_modelId_idx" ON "services"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "controllers" ADD CONSTRAINT "controllers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controllers" ADD CONSTRAINT "controllers_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_fields" ADD CONSTRAINT "model_fields_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_relations" ADD CONSTRAINT "model_relations_sourceModelId_fkey" FOREIGN KEY ("sourceModelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_relations" ADD CONSTRAINT "model_relations_targetModelId_fkey" FOREIGN KEY ("targetModelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_controllerId_fkey" FOREIGN KEY ("controllerId") REFERENCES "controllers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
