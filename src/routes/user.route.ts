import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { userController } from "../controllers/user.controller";


const router = Router();

//  Get User Profile
router.get("/profile", authenticate, userController.getUserProfileController);




export { router as userRouter };
