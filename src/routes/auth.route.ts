import { Router } from "express";
import { authController } from "../controllers/Auth.controller";


const authRouter = Router();


authRouter.post("/signup", authController.registerUserController);
authRouter.post("/login", authController.loginUserController);


export { authRouter };