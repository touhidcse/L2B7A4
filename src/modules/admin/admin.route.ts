import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router =Router()


router.post("/categories", auth(Role.ADMIN), adminController.createNewCatagories)

router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories)

router.get("/users", auth(Role.ADMIN), adminController.getAllusers)

router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus)

router.get("/bookings", auth(Role.ADMIN), adminController.getAllBookings)

export const adminRoutes = router;