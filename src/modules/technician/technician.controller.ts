import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicanService } from "./technician.service";

/**
 * Get all technicians with filters (Public)
 * GET /api/technicians
 */
const getAllTechniciansWithFilter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filters = {
        service: req.query.service as string,
        category: req.query.category as string,
        location: req.query.location as string,
        search: req.query.search as string,
        minRating: req.query.minRating as string,
        isAvailable: req.query.isAvailable as string,
    };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await technicanService.getAllTechniciansWithFilter(filters, page, limit);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Technicians retrieved successfully",
        data: result.technicians,
        meta: result.meta,
    });
});

/**
 * Get technician profile with reviews (Public)
 * GET /api/technicians/:id
 */
const getTechnicianProfileWithReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id;

    const technician = await technicanService.getTechnicianProfileWithReviews(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Technician profile retrieved successfully",
        data: technician,
    });
});

/**
 * Update technician profile (Private - Technician only)
 * PUT /api/technician/profile
 */
const updateTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await technicanService.updateTechnicianProfile(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Technician profile updated successfully",
        data: updatedProfile,
    });
});

/**
 * Update availability slots (Private - Technician only)
 * PUT /api/technician/availability
 */
const updateAvailabilitySlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { availabilities } = req.body;

    if (!availabilities || !Array.isArray(availabilities)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Availabilities must be an array",
            data: null,
        });
    }

    const updatedProfile = await technicanService.updateAvailabilitySlots(userId, availabilities);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Availability slots updated successfully",
        data: updatedProfile,
    });
});

/**
 * Get technician's own bookings (Private - Technician only)
 * GET /api/technician/bookings
 */
const getTechnicianOwnBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { status } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await technicanService.getTechnicianOwnBookings(
        userId,
        status as string,
        page,
        limit
    );

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Bookings retrieved successfully",
        data: result.bookings,
        meta: result.meta,
    });
});

/**
 * Update booking status (Private - Technician only)
 * PATCH /api/technician/bookings/:id
 */
const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id: bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Status is required",
            data: null,
        });
    }

    const updatedBooking = await technicanService.updateBookingStatus(userId, bookingId as string, { status });

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: `Booking ${status.toLowerCase()} successfully`,
        data: updatedBooking,
    });
});

/**
 * Get technician dashboard (Private - Technician only)
 * GET /api/technician/dashboard
 */
const getTechnicianDashboard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const dashboardData = await technicanService.getTechnicianDashboard(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Dashboard data retrieved successfully",
        data: dashboardData,
    });
});

export const technicianController = {
    getAllTechniciansWithFilter,
    getTechnicianProfileWithReviews,
    updateTechnicianProfile,
    updateAvailabilitySlots,
    getTechnicianOwnBookings,
    updateBookingStatus,
    getTechnicianDashboard,
};