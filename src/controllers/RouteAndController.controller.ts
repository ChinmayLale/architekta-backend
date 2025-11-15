import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createControllerSchema } from "../models/Controller.schema";
import { createControllerService } from "../services/controller.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { createRouteSchema } from "../models/Route.schema";
import { createRouteService } from "../services/route.service";

const createRouteAndControllerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { controller, route } = req.body;

        const parsedController = createControllerSchema.parse(controller);

        const parsedRoute = createRouteSchema.parse(route);

        const newController = await createControllerService(parsedController);

        const newRoute = await createRouteService({
            ...parsedRoute,
            controllerId: newController.id,
            authRequired: parsedRoute.authRequired ?? false,
            description: parsedRoute.description ?? null
        });

        // console.log({ newController, newRoute })



        return res.status(201).send(new ApiResponse(201, "Controller created successfully", { newController, newRoute }));
    } catch (error) {
        console.error("❌ Error in createControllerController:", error);

        if (error instanceof ZodError) {
            const errorMessages = error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
            return next(new ApiError(400, "Validation Error", errorMessages.join(' ')));
        }

        return next(new ApiError(500, "Failed to create controller", (error as Error).message));
    }
};

export const ControllerController = {
    createRouteAndControllerController,
};
