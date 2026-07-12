import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createPaymentforAcceptedBooking = catchAsync ( async (req: Request, res: Response, next: NextFunction)=>{

});

const confirmPaymentforAcceptedBooking = catchAsync (async (req: Request,res: Response, next: NextFunction)=>{

});
const getUserOwnPaymentHistory = catchAsync (async (req: Request,res: Response, next: NextFunction)=>{

});
const getPaymentDetails = catchAsync (async (req: Request,res: Response, next: NextFunction)=>{

});

export const paymentController = {
    createPaymentforAcceptedBooking,
    confirmPaymentforAcceptedBooking,
    getUserOwnPaymentHistory,
    getPaymentDetails
}