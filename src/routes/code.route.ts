import { Router } from "express";
import { generateCodeController } from "../controllers/generateCode.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/generate-code", authenticate, generateCodeController);

export default router;