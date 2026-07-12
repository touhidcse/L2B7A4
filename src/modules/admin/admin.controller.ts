import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status" 
import { adminService } from "./admin.service";



const createNewCatagories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await adminService.createNewCatagories(payload)
    
    sendResponse(res,{
        success:true,
        statusCode: httpstatus.CREATED,
        message: "Catergory Created successfully",
        data: {category}
    })
});

const getAllCategories = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

    const allCategory = await adminService.getAllCategories();
    sendResponse(res,{
        success:true,
        statusCode: httpstatus.CREATED,
        message: "All Catergory Fetched successfully",
        data: {allCategory}
    })

});
const getAllusers = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

    const allUser = await adminService.getAllusers();
    sendResponse(res,{
        success:true,
        statusCode: httpstatus.CREATED,
        message: "All User Fetched successfully",
        data: {allUser}
    })

});
const updateUserStatus = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

});
const getAllBookings = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

});


export const adminController ={
    createNewCatagories,
    getAllCategories,
    getAllusers,
    updateUserStatus,
    getAllBookings
}