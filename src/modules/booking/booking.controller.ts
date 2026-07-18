import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { 
    CreateBookingPayload, 
    CancelBookingPayload,
} from "./booking.interface";

/**
 * GET /api/bookings
 */
const getUserOwnBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const result = await bookingService.getUserOwnBookings(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User's own Bookings retrieved successfully",
        data: result,
    });
});

/**
 * Create a new booking (Customer only)
 * POST /api/bookings
 */
const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string;
    const payload: CreateBookingPayload = req.body;
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
    const bookinId = req.params.id;

    const booking = await bookingService.getBookingDetails(bookinId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Booking details retrieved successfully",
        data: booking,
    });
});



/**
 * Check if booking can be cancelled
 * GET /api/bookings/:id/can-cancel
 */
const canCancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId  = req.params.id;
    
    const result = await bookingService.canCancelBooking(bookingId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: result.message,
        data: result,
    });
});

/**
 * Cancel booking (Customer only)
 * Customers can cancel at any point before it reaches IN_PROGRESS status
 * PATCH /api/bookings/:id/cancel
 */
const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const bookingId = req.params.id;
    const payload: CancelBookingPayload = req.body;

    const cancelledBooking = await bookingService.cancelBooking(userId, bookingId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Booking cancelled successfully",
        data: cancelledBooking,
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
    getUserOwnBookings,
    createBooking,
    getBookingDetails,
    cancelBooking,
    canCancelBooking,
    getBookingStats,
};