import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";


const router = Router()

router.post("/register",userController.registerUser)
router.get("/me", auth(), userController.getMyprofile)

export const userRoutes= router;
