import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";


const getAllTechnicianWithFilter = catchAsync( async(req: Request, res:Response, next: NextFunction)=>{

});

const getTechnicianProfileWithReviews = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});

const updateTechnicianProfile = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});

const updateAvailabilitySlots = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

});

const getTechnicianOwnBookings = catchAsync ( async (req: Request, res: Response, next: NextFunction)=>{

});

const updateBookingStatus = catchAsync (async (req: Request, res: Response, next: NextFunction)=>{

})

export const technicanController = {
    getAllTechnicianWithFilter,
    getTechnicianProfileWithReviews,
    updateTechnicianProfile,
    updateAvailabilitySlots,
    getTechnicianOwnBookings,
    updateBookingStatus
}
