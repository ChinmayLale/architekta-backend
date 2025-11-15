import { UserServices } from "../services/user.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response, NextFunction } from "express";



const getUserProfileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params["userId"] as string;

        if (!userId) {
            return next(new ApiError(400, "User ID is required"));
        }

        const user = await UserServices.getUserProfileService(userId);

        if (!user) {
            return next(new ApiError(404, "User not found", "User not found"));
        }

        return res.status(200).send(new ApiResponse(200, "User profile fetched successfully", user));
    } catch (error) {
        console.log("Somthing Went Wrong in getUserProfileController : ");
        console.log({ error });
        return next(new ApiError(500, "Internal Server Error"));
    }
}



export const userController = {
    getUserProfileController
};