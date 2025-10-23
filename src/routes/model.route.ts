import { Router } from "express";
import { ModelController } from "../controllers/Model.controller";
import { authenticate } from "../middlewares/auth.middleware";



const ModelRouter = Router();


ModelRouter.post("/", authenticate, ModelController.createModelController);


export { ModelRouter };