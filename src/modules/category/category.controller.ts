import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus  from "http-status";


const getAllCategories = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{

    const allCategory = await categoryService.getAllCategories();
    sendResponse(res,{
        success:true,
        statusCode: httpstatus.CREATED,
        message: "All Catergory Fetched successfully",
        data: {allCategory}
    })

});


export const categoryController = {
    getAllCategories
}