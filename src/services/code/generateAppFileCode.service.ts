import ejs from "ejs";
import fs from "fs";
import path from "path";
import { generateCodeFileService } from "../file/generateCodeFile.service";

/**
 * Auto-generates app.ts file with all route imports and mounts
 * @param userID - Logged-in user's ID (used for project folder name)
 */
export const generateAppFileService = async (userID: string): Promise<boolean> => {
    try {
        const routesDir = path.join("projects", `Project_${userID}`, "src", "routes");

        if (!fs.existsSync(routesDir)) {
            console.log("⚠️ No routes folder found for user project");
            return false;
        }

        // Read all route files (ending with .route.ts)
        const routeFiles = fs.readdirSync(routesDir).filter((file) => file.endsWith(".route.ts"));

        if (routeFiles.length === 0) {
            console.log("⚠️ No route files found to include in app.ts");
            return false;
        }

        // Prepare router import data
        const routers = routeFiles.map((file) => {
            const nameWithoutExt = file.replace(".route.ts", ""); // e.g. "project"
            const importName = `${nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1)}Router`; // ProjectRouter
            const routePath = nameWithoutExt.toLowerCase(); // e.g. "project"
            return {
                fileName: file.replace(".ts", ""), // "project.route"
                importName,
                routePath,
                name: nameWithoutExt,
            };
        });

        // Render EJS template
        const templatePath = path.join("src", "templates", "app.ejs");

        const renderedCode = await ejs.renderFile(
            templatePath,
            { routers },
            { async: true }
        );

        // Save generated app.ts
        await generateCodeFileService(
            "projects",
            `Project_${userID}/src`,
            "app.ts",
            renderedCode
        );

        console.log(`✅ Generated app.ts for Project_${userID}`);
        return true;
    } catch (error) {
        console.error("❌ Error generating app.ts:", error);
        return false;
    }
};
