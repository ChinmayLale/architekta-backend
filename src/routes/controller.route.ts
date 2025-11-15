import { Router } from "express";
import { ControllerController } from "../controllers/RouteAndController.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();


router.post("/", authenticate, ControllerController.createRouteAndControllerController);



export { router as ControllerRoute };