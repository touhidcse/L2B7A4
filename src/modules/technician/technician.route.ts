import { Router } from "express";
import { technicanController } from "./technicial.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", technicanController.getAllTechnicianWithFilter)
router.get("/:id", technicanController.getTechnicianProfileWithReviews)

router.put("/profile", auth(Role.TECHNICIAN), technicanController.updateTechnicianProfile)
router.put("/availability", auth(Role.TECHNICIAN), technicanController.updateAvailabilitySlots)
router.get("/bookings", auth(Role.TECHNICIAN), technicanController.getTechnicianOwnBookings)
router.patch("/bookings/:id", auth(Role.TECHNICIAN), technicanController.updateBookingStatus)

export const technicianRoutes = router;