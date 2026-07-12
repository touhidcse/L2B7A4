import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createNewBooking = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});

const getUseOwnBookings = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});

const geBookingDetails= catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});



export const bookingController = {
    createNewBooking,
    getUseOwnBookings,
    geBookingDetails
}