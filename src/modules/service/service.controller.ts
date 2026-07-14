import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpstatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";
import { IServiceQuery } from "./service.interface";

/**
 * Get all services with filters (Public)
 * GET /api/services
 */
const getAllServicesWithFilter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query: IServiceQuery = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as string || "price",
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || "asc",
        searchTerm: req.query.searchTerm as string,
        category: req.query.category as string,
        technicianId: req.query.technicianId as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        isBan: req.query.isActive ? req.query.isActive === 'true' : true,
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
