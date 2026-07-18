
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { CreateCommentPayload } from "./review.interface";

const postReviewForCompletedBooking = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{
    const bookingId = req.params.id;
    const customerId = req.user?.id;
    const payload : CreateCommentPayload= req.body;
    const result = await reviewService.postReviewForCompletedBooking(customerId as string, bookingId as string,payload)
})

export const reviewController = {
    postReviewForCompletedBooking
}