import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import { jwtutils } from "../../utils/jwt";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    // console.log(payload);
    const user = await userService.registerUserIntoDB(payload)
    
    sendResponse(res,{
        success:true,
        statusCode: httpstatus.CREATED,
        message: "User registered successfully",
        data: {user}
    })
});

const getMyprofile = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const profile = await userService.getMyprofileFromDB(req.user?.id as string)
   
    sendResponse(res,{
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile fetched successfully",
        data: {profile}
    })

})


const updateCustomerProfile = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userService.updateCustomerProfileIntoDB(userId,payload);
    sendResponse(res,{
        success: true,
        statusCode: httpstatus.OK,
        message: "User Profile Updated successfully",
        data: {updatedProfile}
    })
})

export const userController = {
    registerUser,
    getMyprofile,
    updateCustomerProfile
}