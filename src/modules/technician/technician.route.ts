import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";


const router = Router()




router.put("/profile", auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)

router.get("/availability", auth(Role.TECHNICIAN), technicianController.getTechnicianOwnAvailabilities)




router.post("/availability", auth(Role.TECHNICIAN), technicianController.createAvailabilities)


router.put("/availability", auth(Role.TECHNICIAN), technicianController.updateAvailabilitySlots)

// router.delete("/availability", auth(Role.TECHNICIAN), technicianController.deleteAvailabilityById)

router.get("/bookings", auth(Role.TECHNICIAN), technicianController.getTechnicianOwnBookings)
router.patch("/bookings/:id", auth(Role.TECHNICIAN), technicianController.updateBookingStatus)
router.get("/dashboard", auth(Role.TECHNICIAN), technicianController.getTechnicianDashboard );

// Public
router.get("/", technicianController.getAllTechniciansWithFilter)
router.get("/:id", technicianController.getTechnicianProfileWithReviews)

export const technicianRoutes = router;