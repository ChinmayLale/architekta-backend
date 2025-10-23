import { ZodError } from "zod";
import { createModelSchema } from "../models/Model.schema";
import { createModelService } from "../services/models.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from "express";


const createModelController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId;


        const parsedData = createModelSchema.parse(req.body);

        // 2️⃣ Call the service
        const newModel = await createModelService(parsedData, userId);

        // 3️⃣ Send response
        return res.status(201).send(new ApiResponse(201, "Model created successfully", newModel));
    } catch (error) {
        console.error("❌ Error in createModelController:", error);
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
            return next(new ApiError(400, "Validation Error", errorMessages.join(' ')));
        }

        return next(new ApiError(500, "Failed to create model", (error as Error).message));
    }
}




export const ModelController = {
    createModelController,
}