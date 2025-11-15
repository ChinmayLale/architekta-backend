import fs from "fs";
import path from "path";

/**
 * Creates a full folder structure and writes generated code into the final file.
 * Example output path:
 * src/projects/<userId>_<projectName>/prisma/schema/<fileName>.prisma
 *
 * @param baseDir - Base directory (usually "src/projects")
 * @param projectFolder - Name of the project folder (e.g., "userId_projectName")
 * @param fileName - File name (e.g., "Post")
 * @param code - The code/content to write
 * @param extension - File extension (default: ".prisma")
 * @returns Full path of the written file
 */
export const generateModelCodeFileService = async (
  baseDir: string,
  projectFolder: string,
  fileName: string,
  code: string,
  extension = ".prisma"
): Promise<string> => {
  try {
    // Construct full folder path
    const fullDir = path.join(baseDir, projectFolder, "prisma", "schema");

    // Create directories recursively
    await fs.promises.mkdir(fullDir, { recursive: true });

    // Final file path
    const filePath = path.join(fullDir, `${fileName}${extension}`);

    // Write the file
    await fs.promises.writeFile(filePath, code, "utf8");

    // console.log(`✅ File written successfully at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("❌ Error writing generated file:", error);
    throw error;
  }
};
