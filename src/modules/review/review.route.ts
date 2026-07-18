import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();

// customer only, auth middleware implemented in app.ts file

router.post("/:id", reviewController.postReviewForCompletedBooking)

export const reviewRoutes = router;


