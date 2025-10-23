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




export const confidCodeService = {
    generateDBConfigService,
    copyUtilsFolder
}