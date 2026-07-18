import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpstatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";


/**
 * Get all services with filters (Public)
 * GET /api/services
 */
const getAllServicesWithFilter = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    const query = {
        type: req.query.type as string,
        location: req.query.location as string,
        rating: req.query.rating 
            ? Number(req.query.rating) 
            : undefined,

        page: req.query.page 
            ? Number(req.query.page) 
            : 1,

        limit: req.query.limit 
            ? Number(req.query.limit) 
            : 10,
    };


    const result = await serviceService.getAllServicesWithFilter(query);


    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Services retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

export const serviceController = {
    getAllServicesWithFilter,
};
