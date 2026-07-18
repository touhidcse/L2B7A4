import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// All booking routes require authentication
router.use(auth());

// Get user's own bookings 
router.get("/", auth(Role.CUSTOMER), bookingController.getUserOwnBookings);

// Get booking statistics
router.get("/stats", bookingController.getBookingStats);

// Create booking (Customer only)
router.post("/", auth(Role.CUSTOMER), bookingController.createBooking);

// Get booking details
router.get("/:id", bookingController.getBookingDetails);

// Check if booking can be cancelled
router.get("/:id/can-cancel", bookingController.canCancelBooking);

// Cancel booking (Customer only)
// Customers can cancel at any point before it reaches IN_PROGRESS status
router.patch("/:id/cancel", auth(Role.CUSTOMER), bookingController.cancelBooking);

export const bookingRoutes = router;