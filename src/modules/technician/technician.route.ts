import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";


const router = Router()

router.get("/", technicianController.getAllTechniciansWithFilter)

router.get("/:id", technicianController.getTechnicianProfileWithReviews)

router.put("/profile", auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)
router.put("/availability", auth(Role.TECHNICIAN), technicianController.updateAvailabilitySlots)
router.get("/bookings", auth(Role.TECHNICIAN), technicianController.getTechnicianOwnBookings)
router.patch("/bookings/:id", auth(Role.TECHNICIAN), technicianController.updateBookingStatus)
router.get("/dashboard", auth(Role.TECHNICIAN), technicianController.getTechnicianDashboard );

export const technicianRoutes = router;