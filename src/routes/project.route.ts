import { Router } from "express";
import { createProjectController, getProjectByIdController } from "../controllers/Project.controller";
import { authenticate } from "../middlewares/auth.middleware";

const projectRouter = Router();

projectRouter.post("/", authenticate, createProjectController);

projectRouter.get("/:projectId", authenticate, getProjectByIdController);



export { projectRouter };