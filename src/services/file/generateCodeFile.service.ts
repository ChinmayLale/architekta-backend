import fs from "fs";
import path from "path";

/**
 * Generates a code file at the given directory and subfolder.
 * Creates folders automatically if they don't exist.
 * 
 * @param baseDir - Base directory (e.g. "src/projects")
 * @param projectFolder - Folder for the project (e.g. "Project_<userID>")
 * @param fileName - Name of the file (e.g. "User.ts" or "package.json")
 * @param code - The actual content to write
 */
export const generateCodeFileService = async (
    baseDir: string,
    projectFolder: string,
    fileName: string,
    code: string
): Promise<void> => {
    try {
        // Ensure full file path
        const fullDirPath = path.join(baseDir, projectFolder);
        const fullFilePath = path.join(fullDirPath, fileName);

        // ✅ Create all directories (including nested ones)
        await fs.promises.mkdir(path.dirname(fullFilePath), { recursive: true });

        // Write the file
        await fs.promises.writeFile(fullFilePath, code, "utf-8");

        console.log(`✅ File created: ${fullFilePath}`);
    } catch (error) {
        console.error(`❌ Error writing file (${fileName}):`, error);
        throw error;
    }
};
