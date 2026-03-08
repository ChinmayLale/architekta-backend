import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import { generateModelCodeService } from "../services/code/modelCode.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Controller, Model, ModelField, Project, Route, Service } from "@prisma/client";
import { ProjectService } from "../services/Project.service";
import { generatePackageJsonCodeService } from "../services/code/packageJsonCode.service";
import { confidCodeService } from "../services/code/configCode.service";
import { generateControllerCodeService } from "../services/code/controllerCode.service";
import { generateServiceCodeService } from "../services/code/serviceCode.service";
import { generateRouterCodeService } from "../services/code/routeCode.service";
import { generateAppFileService } from "../services/code/generateAppFileCode.service";
import { generateIndexFileCodeService } from "../services/code/generateIndexFile.service";

type ProjectWithRelations = Project & {
    models: (Model & {
        fields: ModelField[];
    })[];
    routes: Route[];
    controllers: Controller[];
    services: Service[];
};

export const generateCodeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userID = req.user.userId as string;
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).send(new ApiError(400, "Project ID is required"));
        }

        // Fetch project
        const project = await ProjectService.getProjectByIdService(projectId, userID);
        
        if (!project) {
            return res.status(404).send(new ApiError(404, "Project not found"));
        }

        const { name, models, routes, controllers, services, slug } = project;

        // ========================================
        // 📝 GENERATE ALL CODE FILES
        // ========================================
        
        await generatePackageJsonCodeService(project, userID);
        await confidCodeService.generateMiddlewareConfigService(userID);
        const code = await generateModelCodeService(models, userID);
        await confidCodeService.generateDBConfigService(userID);
        await generateControllerCodeService(models, userID);
        await generateServiceCodeService(models, userID);
        await generateRouterCodeService(routes, controllers, userID);
        await confidCodeService.copyUtilsFolder(userID);
        await generateAppFileService(userID);
        await generateIndexFileCodeService(userID);

        if (!code) {
            return res.status(500).send(
                new ApiError(500, "Failed to generate code", "Something went wrong")
            );
        }

        console.log("✅ All code files generated successfully");

        // ========================================
        // 📦 STREAM ZIP DIRECTLY TO CLIENT
        // ========================================
        
        const projectFolder = path.join("projects", `Project_${userID}`);
        const zipFileName = `${slug || 'backend-project'}_${Date.now()}.zip`;

        // Set response headers for download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

        // Create archive and stream directly to response
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        // Handle errors
        archive.on('error', (err) => {
            console.error("❌ ZIP streaming error:", err);
            throw err;
        });

        // Pipe archive to response
        archive.pipe(res);

        // Add project folder to archive
        archive.directory(projectFolder, false);

        // Finalize archive
        await archive.finalize();

        console.log(`✅ ZIP streamed to client: ${zipFileName}`);

        // ========================================
        // 🗑️ CLEANUP: Delete project folder after streaming
        // ========================================
        
        archive.on('end', () => {
            setTimeout(async () => {
                try {
                    await fs.promises.rm(projectFolder, { recursive: true, force: true });
                    console.log(`🗑️ Deleted project folder: ${projectFolder}`);
                } catch (error) {
                    console.error("❌ Error deleting folder:", error);
                }
            }, 5000); // Delete after 5 seconds
        });

    } catch (error) {
        console.log("❌ Error in generateCodeController:", error);
        return next(error);
    }
};