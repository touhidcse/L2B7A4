import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router()

router.post("/register",userController.registerUser)
router.get("/me", auth(), userController.getMyprofile)
router.put("/updatecustomer", auth(Role.CUSTOMER), userController.updateCustomerProfile)

export const userRoutes= router;
