import { generateCodeFileService } from "../file/generateCodeFile.service";



const INDEXFILE_CODE = `
import { ConnectToDB } from './config/db.config'
import { app } from './app'
import dotenv from 'dotenv'
dotenv.config({
    path: '../.env'
})


ConnectToDB().then(
    () => {
        const PORT = process.env['PORT'] || 8000;
        app.listen(PORT, () => {
            console.log("✅ App is Listening on Port " + PORT);
        })
    }
).catch(
    (e: Error) => {
        console.error(e);
    }
)

`
export const generateIndexFileCodeService = async (userID: string): Promise<boolean> => {
    try {
        await generateCodeFileService(
            "projects",
            `Project_${userID}/src/`,
            "index.ts",
            INDEXFILE_CODE
        )
        return true;
    } catch (error) {
        console.log("Somthing went wrong in generateIndexFileCodeService file", error);
        return false;
    }
}