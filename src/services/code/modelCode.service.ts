import { Model, ModelField } from "@prisma/client";
import ejs from "ejs";
import { generateModelCodeFileService } from "../file/generateModelFiles.service";

export const generateModelCodeService = async (
    modelData: (Model & { fields?: ModelField[] }) | (Model & { fields?: ModelField[] })[],
    userID: string
): Promise<boolean> => {
    try {
        const templatePath = "src/templates/model.ejs";
        const models = Array.isArray(modelData) ? modelData : [modelData];
        const generatedCodes: string[] = [];

        if (!models.length) {
            console.log("❌ No models provided");
            return false;
        }

        for (const model of models) {
            const fields = model.fields || [];

            // 🧠 Extract pure model name (remove userId_ prefix)
            const cleanModelName = model.name.includes("_")
                ? model.name.split("_")[1]
                : model.name;

            if (!cleanModelName) {
                console.log("❌ Invalid model name:", model.name);
                continue;
            }

            const code = await ejs.renderFile(
                templatePath,
                {
                    model: { ...model, name: cleanModelName, fields },
                    userID,
                },
                { async: true }
            );

            // 🗂 Save file with clean model name
            await generateModelCodeFileService(
                "projects",
                `Project_${userID}`,
                cleanModelName,
                code
            );

            generatedCodes.push(code);
            console.log(`✅ Generated model: ${cleanModelName}`);
        }

        return true;
    } catch (error) {
        console.log("❌ Error generating model code:", error);
        return false;
    }
};
