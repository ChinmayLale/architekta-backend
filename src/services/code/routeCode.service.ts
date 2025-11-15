import ejs from "ejs";
import path from "path";
import { Controller, Route } from "@prisma/client";
import { generateCodeFileService } from "../file/generateCodeFile.service";

/**
 * Generates Express Router code from routes data using EJS templates
 * and saves it in /src/routes folder inside user’s project directory.
 */
export const generateRouterCodeService = async (
  routes: Route[],
  controllers: Controller[],
  userID: string
): Promise<boolean> => {
  try {
    if (!routes?.length) {
      console.log("⚠️ No routes to generate");
      return false;
    }

    const templatePath = path.join("src", "templates", "route.ejs");

    // ✅ Group routes by controllerId
    const groupedByController = routes.reduce<Record<string, Route[]>>((acc, route) => {
      const controllerId = route.controllerId;
      if (!controllerId) return acc;

      if (!acc[controllerId]) acc[controllerId] = [];
      acc[controllerId].push(route);
      return acc;
    }, {});

    // ✅ Loop through each controller group
    for (const [controllerId, controllerRoutes] of Object.entries(groupedByController)) {
      const controllerObj = controllers.find((c) => c.id === controllerId);
      if (!controllerObj) {
        console.log(`⚠️ Skipping routes — no controller found for ID: ${controllerId}`);
        continue;
      }

      const controllerName = controllerObj.name; // e.g. "PostsController"
      const controllerFileName = controllerName.replace(/Controller$/i, "").toLowerCase();

      // ✅ Map method names automatically
      const mappedRoutes = controllerRoutes.map((r) => {
        let handlerName = "handler";

        const method = r.method.toUpperCase();
        const path = r.path;

        if (method === "GET" && path.includes(":id")) handlerName = "getById";
        else if (method === "GET") handlerName = "getAll";
        else if (method === "POST") handlerName = "create";
        else if (["PUT", "PATCH"].includes(method)) handlerName = "update";
        else if (method === "DELETE") handlerName = "delete";

        return {
          path: r.path,
          method: r.method,
          handlerName,
          authRequired: r.authRequired,
        };
      });

      // ✅ Render EJS template
      const renderedCode = await ejs.renderFile(
        templatePath,
        {
          controllerName,
          controllerFileName,
          routes: mappedRoutes,
        },
        { async: true }
      );

      await generateCodeFileService(
        "projects",
        `Project_${userID}/src/routes`,
        `${controllerFileName}.route.ts`,
        renderedCode
      );

      console.log(`✅ Generated router for controller: ${controllerName}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Error generating router code:", error);
    return false;
  }
};
