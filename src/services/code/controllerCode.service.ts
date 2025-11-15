import ejs from "ejs";
import path from "path";
import { generateCodeFileService } from "../file/generateCodeFile.service";
import { Model } from "@prisma/client";

/**
 * Generates controller code files for each model
 * using the controller.ejs template.
 * 
 * @param models - List of models with their metadata
 * @param userID - ID of the logged-in user (for folder naming)
 * @returns boolean - true if successful
 */
export const generateControllerCodeService = async (
    models: Model[],
    userID: string
): Promise<boolean> => {
    try {
        if (!models?.length) {
            console.log("⚠️ No models provided for controller generation");
            return false;
        }

        const templatePath = path.join("src", "templates", "controller.ejs");

        for (const model of models) {
            const cleanModelName = model.name.includes("_")
                ? model.name.split("_")[1]
                : model.name;

            if (!cleanModelName) {
                console.log("❌ Invalid model name:", model.name);
                continue;
            }

            const controllerName = `${cleanModelName}Controller`;

            const renderedCode = await ejs.renderFile(
                templatePath,
                {
                    controllerName: "PostController",
                    modelName: "Post",
                    operations: ["CREATE", "FIND_ALL"]
                },
                { async: true }
            );

            await generateCodeFileService(
                "projects",
                `Project_${userID}/src/controllers`,
                `${cleanModelName.toLowerCase()}.controller.ts`,
                renderedCode
            );

            console.log(`✅ Generated controller: ${controllerName}`);
        }

        return true;
    } catch (error) {
        console.error("❌ Error generating controller code:", error);
        return false;
    }
};
