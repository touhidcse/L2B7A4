import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createNewBooking);
router.get("/", auth(Role.CUSTOMER), bookingController.getUseOwnBookings);
router.get("/:id", auth(Role.CUSTOMER), bookingController.geBookingDetails);

export const bookingRoutes = router;