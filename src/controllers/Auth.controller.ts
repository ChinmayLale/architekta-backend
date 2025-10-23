// import { jwtPayload } from "../types";
import { authService } from "../services/Auth.service";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Provider, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";


const registerUserController = async (req: Request, res: Response, next: Function) => {
    try {
        const { email, provider, password } = req.body;

        if (!email || !provider) {
            return next(new ApiError(400, "Email and Provider are required fields."));
        }


        const providerValue = provider as Provider;
        if (!Object.values(Provider).includes(providerValue)) {
            return next(new ApiError(400, "Invalid provider type."));
        }


        const userData: Partial<User> = {
            email,
            provider,
            passwordHash: password
        };

        const registeredUser = await authService.signupUserService(userData);

        if (!registeredUser) {
            return next(new ApiError(500, "User registration failed."));
        }

        return res.status(201).send(new ApiResponse(201, "User registered successfully", registeredUser, true));
    } catch (error: Error | any) {
        console.log("Something went wrong in the registerUserController");
        console.log({ error })
        return next(new ApiError(500, "Something went wrong in the registerUserController", error.message));
    }
}



const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, provider, password } = req.body;

        if (!email || !provider) {
            return next(new ApiError(400, "Email and Provider are required fields."));
        }

        const providerValue = provider as Provider;
        if (!Object.values(Provider).includes(providerValue)) {
            return next(new ApiError(400, "Invalid provider type."));
        }

        const loggedInUser = await authService.loginUserService(email, provider, password);

        if (!loggedInUser) {
            return next(new ApiError(401, "Invalid credentials or provider mismatch."));
        }

        const payload = {
            userId: loggedInUser.id,
            email: loggedInUser.email,
            provider: loggedInUser.provider as Provider
        }

        const newJwtToken = await authService.createJwtToken(payload);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'lax' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        const { passwordHash, ...userWithoutPassword } = loggedInUser;
        return res
            .cookie('auth_token', newJwtToken, cookieOptions)
            .status(200)
            .send(new ApiResponse(200, "User logged in successfully", { ...userWithoutPassword, newJwtToken }, true));

    } catch (error: any) {
        console.log("Something went wrong in the loginUserController");
        console.log({ error });
        return next(new ApiError(500, "Something went wrong while logging in", error.message));
    }
};




export const authController = {
    registerUserController,
    loginUserController
}