import { Model, ModelField, Project } from "@prisma/client";
import ejs from "ejs";
import { ProjectWithRelations } from "../../types/project.type";
import { generateCodeFileService } from "../file/generateCodeFile.service";


export const generatePackageJsonCodeService = async (data: ProjectWithRelations, userID: string): Promise<boolean> => {
    try {
        const templatePath = "src/templates/package.ejs";

        const code = await ejs.renderFile(
            templatePath,
            {
                project: data,
                userID,
            },
            { async: true }
        );

        const schemaPrisma = `generator client {
            provider = "prisma-client-js"
        }
          
        datasource db {
            provider = "postgresql"
            url      = env("DATABASE_URL")
        }
          `;

        // console.log({code})
        await generateCodeFileService(
            "projects",
            `Project_${userID}`,
            "package.json",
            code
        );

        await generateCodeFileService(
            "projects",
            `Project_${userID}`,
            "prisma/schema/schema.prisma",
            schemaPrisma
        );

        console.log(`✅ Generated package.json for project: ${data.name}`);
        return true;
    } catch (error) {
        console.log("❌ Error generating package.json code:", error);
        return false;
    }

}