import { createProjectSchema } from "../models/Project.schema";
import { ProjectService } from "../services/Project.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import { CreateProjectDTO } from "../types/project.type";

export const createProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user.userId;
        // console.log("Request Body:", req.body);
        const parsedData = createProjectSchema.parse({ ...req.body, userId });

        const newProject = await ProjectService.createProjectService(parsedData as CreateProjectDTO);

        return res
            .status(201)
            .json(new ApiResponse(201, "✅ Project created successfully", newProject));
    } catch (error) {
        console.error("❌ Error in createProjectController:", error);
        return next(new ApiError(500, "Failed to create project", (error as Error).message));
    }
};



export const getProjectByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const userID = req.user.userId;
        const projectId = req.params['projectId'];
        if (!projectId) {
            return res.status(400).send(new ApiError(400, "Project ID is required"));
        }

        const project = await ProjectService.getProjectByIdService(projectId, userID);

        return res
            .status(200)
            .json(new ApiResponse(200, "✅ Project fetched successfully", project));
    } catch (error) {
        console.error("❌ Error in getProjectByIdController:", error);
        return next(new ApiError(500, "Failed to get project", (error as Error).message));
    }
}
