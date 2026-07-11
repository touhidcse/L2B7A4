import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router =Router()


router.post("/categories", auth(Role.ADMIN), adminController.createNewCatagories)

export const adminRoutes = router;