import archiver from "archiver";
import fs from "fs";
import path from "path";

/**
 * Creates a ZIP file from a project folder
 * @param projectFolder - Path to the project folder (e.g., "projects/Project_userId")
 * @param outputName - Name of the ZIP file (e.g., "my-backend")
 * @returns Path to the created ZIP file
 */
export const createZipService = async (
    projectFolder: string,
    outputName: string
): Promise<string> => {
    try {
        // Create 'downloads' folder if it doesn't exist
        const downloadsDir = path.join("downloads");
        await fs.promises.mkdir(downloadsDir, { recursive: true });

        // Output ZIP path
        const zipFileName = `${outputName}_${Date.now()}.zip`;
        const zipPath = path.join(downloadsDir, zipFileName);

        // Create write stream
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", {
            zlib: { level: 9 }, // Maximum compression
        });

        // Promise to wait for ZIP completion
        return new Promise((resolve, reject) => {
            output.on("close", () => {
                console.log(`✅ ZIP created: ${zipPath} (${archive.pointer()} bytes)`);
                resolve(zipPath);
            });

            archive.on("error", (err) => {
                console.error("❌ ZIP creation error:", err);
                reject(err);
            });

            // Pipe archive to output file
            archive.pipe(output);

            // Add the entire project folder to ZIP
            archive.directory(projectFolder, false);

            // Finalize the archive
            archive.finalize();
        });
    } catch (error) {
        console.error("❌ Error creating ZIP:", error);
        throw error;
    }
};