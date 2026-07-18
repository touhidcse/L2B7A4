import { Router } from "express";
import { reviewController } from "./review.controller";

const router = Router();





router.post("/:id", reviewController.postReviewForCompletedBooking)




export const reviewRoutes = router;


