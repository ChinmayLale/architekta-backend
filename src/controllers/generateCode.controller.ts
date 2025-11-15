import { NextFunction, Request, Response } from "express";
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

        // let  status = false;
        const userID = req.user.userId as string;

        const { projectId } = req.body

        if (!projectId) {
            return res.status(400).send(new ApiError(400, "Project ID is required"));
        }

        // Fetch project with models and fields
        const project = await ProjectService.getProjectByIdService(projectId, userID);
        // console.log({ project })
        if (!project) {
            return res.status(404).send(new ApiError(404, "Project not found"));
        }
        const { name, models, routes, controllers, services, slug, status, description } = project



        // Generate Package.json
        const packageJsonFile = generatePackageJsonCodeService(project, userID);

        //Generate Middleware Config in src/config/middleware.config.ts

        const middlewareConfigCode = await confidCodeService.generateMiddlewareConfigService(userID);

        // Generate code for each model
        const code = await generateModelCodeService(models, userID);

        // Generate DB Cofig in src/config/db.config.ts
        const dbConfigCode = await confidCodeService.generateDBConfigService(userID);


        // Generate COntroller COde for each model
        const controllerCode = await generateControllerCodeService(models, userID);


        // Generate Services code 
        const serviceCode = await generateServiceCodeService(models, userID);

        // Generate Routes code
        const routeCode = await generateRouterCodeService(routes, controllers, userID);


        //get Utils Folder
        const utilsFolders = await confidCodeService.copyUtilsFolder(userID);


        //generate AppFile code 
        const appFileCode = await generateAppFileService(userID);

        // Generate Index File Code
        const indexFileCode = await generateIndexFileCodeService(userID)

        if (!code) {
            return res.status(500).send(new ApiError(500, "Failed to generate code", "Something went wrong while generating model code"));
        }

        setTimeout(async () => {
            console.log("started File Deletion");
        }, 20000)
        return res.status(200).send(new ApiResponse(200, "Code generated successfully", [],));
    } catch (error) {
        console.log("❌ Error in generateModelCodeController:", error);
        return next(error);
    }
};