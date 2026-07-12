import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";


const getAllServicesWithFilter = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

});


export const serviecController = {
    getAllServicesWithFilter
}