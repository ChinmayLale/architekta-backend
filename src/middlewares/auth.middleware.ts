// middleware/authenticate.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { jwtPayload } from "../services/Auth.service";


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let tokenSource: "header" | "cookie" | undefined;

    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
        tokenSource = "header";
    } else if (req.cookies['token']) {
        token = req.cookies['token'];
        tokenSource = "cookie";
    }

    // console.log({ tokenSource, token });
    if (!token) {
        return res.status(401).send(new ApiError(401, "Authentication token is required"));
    }

    try {
        const decoded = jwt.verify(
            token,
            "jgwj2iwigj3tu85uvu2r92c42n49vuyuu20cu2020u3un95b3v7vy4y208c010jnv v3u574y204208"
        ) as jwtPayload;

        // console.log({ decoded })
        if (!decoded) {
            return res.status(403).send(new ApiError(403, "Invalid token payload", "Invalid token payload"));
        }
        req.user = decoded; // ✅ Now `req.user` is fully typed
        next();
    } catch (error) {
        console.error("JWT verification error:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return next(new ApiError(401, "Token has expired", "Token has expired"));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(403, "Invalid token", "Invalid token"));
        }

        return next(new ApiError(500, "Unexpected error during authentication", "Internal Server Error "));
    }

};
