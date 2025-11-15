import ejs from "ejs";
import path from "path";
import { generateCodeFileService } from "../file/generateCodeFile.service";
import { Model } from "@prisma/client";

/**
 * Generates service code files for each model
 * using the service.ejs template.
 * 
 * @param models - List of models with their metadata
 * @param userID - ID of the logged-in user (for folder naming)
 * @returns boolean - true if successful
 */
export const generateServiceCodeService = async (
    models: Model[],
    userID: string
): Promise<boolean> => {
    try {
        if (!models?.length) {
            console.log("⚠️ No models provided for service generation");
            return false;
        }

        const templatePath = path.join("src", "templates", "service.ejs");

        for (const model of models) {
            const cleanModelName = model.name.includes("_")
                ? model.name.split("_")[1]
                : model.name;

            if (!cleanModelName) {
                console.log("❌ Invalid model name:", model.name);
                continue;
            }

            const lowerModelName =
                cleanModelName.charAt(0).toLowerCase() + cleanModelName.slice(1);

            const renderedCode = await ejs.renderFile(
                templatePath,
                {
                    modelName: cleanModelName,
                    lowerModelName,
                },
                { async: true }
            );

            await generateCodeFileService(
                "projects",
                `Project_${userID}/src/services`,
                `${cleanModelName.toLowerCase()}.service.ts`,
                renderedCode
            );

            console.log(`✅ Generated service: ${cleanModelName}Service`);
        }

        return true;
    } catch (error) {
        console.error("❌ Error generating service code:", error);
        return false;
    }
};
