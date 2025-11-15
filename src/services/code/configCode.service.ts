import { generateCodeFileService } from "../file/generateCodeFile.service";
import fs from "fs";
import path from "path";



const dbConfigTemplate = `
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import dotenv from 'dotenv'
import { withAccelerate } from '@prisma/extension-accelerate';
dotenv.config()

const prisma = new PrismaClient({
    // log: ['info','query','warn','error'],
    log: [{ emit: 'event', level: 'query' }],
    errorFormat: 'pretty'
}).$extends(withAccelerate())


const ConnectToDB = async () => {
    try {
        await prisma.$connect()
        console.log('✅ Database connected successfully!');
    }
    catch (error:any) {
        console.error('❌ Database connection failed ', error);
        throw new ApiError(400, "Cannot connect to DB", error.message);
    }
}


export {
    prisma,
    ConnectToDB
}
`;

const generateDBConfigService = async (userID: string): Promise<boolean> => {
    try {
        await generateCodeFileService(
            "projects",
            `Project_${userID}`,
            "src/config/db.config.ts",
            dbConfigTemplate
        );
        return true
    } catch (error) {
        console.log("❌ Error generating DB config code:", error);
        return false;
    }
}



const copyUtilsFolder = async (userId: string) => {
    const sourceDir = path.join(process.cwd(), "src/utils"); // your main utils folder
    const destDir = path.join(process.cwd(), "projects", `Project_${userId}`, "src/utils");

    // Ensure the destination folder exists
    fs.mkdirSync(destDir, { recursive: true });

    // Copy recursively
    const copyRecursive = (src: string, dest: string) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    };

    copyRecursive(sourceDir, destDir);

    console.log(`📁 Copied utils folder to user project: ${destDir}`);
};


const generateMiddlewareConfigService = async(userID:string):Promise<boolean>=>{
    try {
        const middlewareConfigTemplate = `
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
        req.user = decoded; // ✅ Now 'req.user' is fully typed
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
`
        await generateCodeFileService(
            "projects",
            `Project_${userID}`,
            "src/middleware/auth.middleware.ts",
            middlewareConfigTemplate
        );
        return true;
    } catch (error) {
        console.log("❌ Error generating Middleware config code:", error);
        return false;
    }
}



export const confidCodeService = {
    generateDBConfigService,
    copyUtilsFolder,
    generateMiddlewareConfigService
}