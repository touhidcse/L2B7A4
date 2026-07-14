import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { 
    CreateBookingPayload, 
    CancelBookingPayload,
    IBookingQuery 
} from "./booking.interface";

/**
 * Get all bookings with advanced filtering
 * GET /api/bookings
 */
const getBookingsWithFilter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const query: IBookingQuery = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as string || "bookingDate",
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || "desc",
        status: req.query.status as any,
        searchTerm: req.query.searchTerm as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        customerId: req.query.customerId as string,
        technicianId: req.query.technicianId as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const result = await bookingService.getBookingsWithFilter(query, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Bookings retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Create a new booking (Customer only)
 * POST /api/bookings
 */
const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const payload: CreateBookingPayload = req.body;

    // Validate required fields
    if (!payload.technicianId) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Technician ID is required",
            data: null,
        });
    }

    if (!payload.serviceId) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Service ID is required",
            data: null,
        });
    }

    if (!payload.startAt) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Start time is required",
            data: null,
        });
    }

    if (!payload.endAt) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "End time is required",
            data: null,
        });
    }

    // Validate date formats
    if (isNaN(new Date(payload.startAt).getTime())) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid start time format",
            data: null,
        });
    }

    if (isNaN(new Date(payload.endAt).getTime())) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid end time format",
            data: null,
        });
    }

    // Validate that start time is before end time
    const start = new Date(payload.startAt);
    const end = new Date(payload.endAt);
    if (start >= end) {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Start time must be before end time",
            data: null,
        });
    }

    const booking = await bookingService.createBooking(customerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "Booking created successfully",
        data: booking,
    });
});

/**
 * Get booking details by ID
 * GET /api/bookings/:id
 */
const getBookingDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid booking ID",
            data: null,
        });
    }

    const booking = await bookingService.getBookingDetails(userId, id);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Booking details retrieved successfully",
        data: booking,
    });
});

/**
 * Cancel booking (Customer only)
 * Customers can cancel at any point before it reaches IN_PROGRESS status
 * PATCH /api/bookings/:id/cancel
 */
const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const payload: CancelBookingPayload = req.body;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid booking ID",
            data: null,
        });
    }

    const cancelledBooking = await bookingService.cancelBooking(userId, id, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Booking cancelled successfully",
        data: cancelledBooking,
    });
});

/**
 * Check if booking can be cancelled
 * GET /api/bookings/:id/can-cancel
 */
const canCancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid booking ID",
            data: null,
        });
    }
    
    const result = await bookingService.canCancelBooking(id);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: result.message,
        data: result,
    });
});

/**
 * Get booking statistics
 * GET /api/bookings/stats
 */
const getBookingStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const stats = await bookingService.getBookingStats(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Booking statistics retrieved successfully",
        data: stats,
    });
});

export const bookingController = {
    getBookingsWithFilter,
    createBooking,
    getBookingDetails,
    cancelBooking,
    canCancelBooking,
    getBookingStats,
};