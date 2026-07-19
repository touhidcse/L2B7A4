import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";
import {
    CreateBookingPayload,
    CancelBookingPayload,
} from "./booking.interface";
import { Prisma } from "../../../generated/prisma/client";
import { equal } from "node:assert";

/**
 * GET /api/bookings
 */
const getUserOwnBookings = async (customerId: string) => {


    const bookings = await prisma.booking.findMany({
        where: {
            customerId
        }
    })

    return bookings
};

/**
 * Create a new booking (Customer only)
 * POST /api/bookings
 */
const createBooking = async (customerId: string, payload: CreateBookingPayload) => {

    // Validate required fields
    if (!payload.technicianId) {
        throw new Error("Technician ID is required")
    }

    if (!payload.serviceId) {
        throw new Error("Service ID is required")
    }

    if (!payload.startAt) {
        throw new Error("Start time is required")
    }

    if (!payload.endAt) {
        throw new Error("End time is required")
    }

    // Validate date formats
    if (isNaN(new Date(payload.startAt).getTime())) {
        throw new Error("Invalid start time format")
    }

    if (isNaN(new Date(payload.endAt).getTime())) {
        throw new Error("Invalid end time format")
    }

    // Validate that start time is before end time
    const start = new Date(payload.startAt);
    const end = new Date(payload.endAt);
    if (start >= end) {
        throw new Error("Start time must be before end time")
    }

    const { technicianId, serviceId, startAt, endAt, bookingDate } = payload;

    // Check if customer exists and is not banned
    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { id: true, isBan: true },
    });

    if (!customer) {
        throw {
            statusCode: 404,
            message: "Customer not found",
            code: "CUSTOMER_NOT_FOUND",
        };
    }

    if (customer.isBan) {
        throw {
            statusCode: 403,
            message: "Your account is banned. Please contact support.",
            code: "ACCOUNT_BANNED",
        };
    }

    // Check if technician exists and is available
    const technician = await prisma.technicianProfile.findUnique({
        where: { id: technicianId },
        include: {
            user: {
                select: {
                    id: true,
                    isBan: true,
                },
            },
            availability: {
                where: {
                    day: new Date(startAt).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() as any,
                    isAvailable: true,
                },
            },
        },
    });

    if (!technician) {
        throw {
            statusCode: 404,
            message: "Technician not found",
            code: "TECHNICIAN_NOT_FOUND",
        };
    }

    if (technician.user.isBan) {
        throw {
            statusCode: 403,
            message: "Technician is currently unavailable",
            code: "TECHNICIAN_UNAVAILABLE",
        };
    }

    // Check if service exists and belongs to technician
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
            category: true,
        },
    });

    if (!service) {
        throw {
            statusCode: 404,
            message: "Service not found",
            code: "SERVICE_NOT_FOUND",
        };
    }

    if (service.technicianId !== technicianId) {
        throw {
            statusCode: 400,
            message: "This service does not belong to the selected technician",
            code: "INVALID_SERVICE_TECHNICIAN",
        };
    }

    // Check for overlapping bookings
    const startDateTime = new Date(startAt);
    const endDateTime = new Date(endAt);
    const bookingDateTime = bookingDate ? new Date(bookingDate) : new Date();

    const overlappingBookings = await prisma.booking.findMany({
        where: {
            technicianId: technicianId,
            status: {
                notIn: ['CANCELLED', 'DECLINED', 'COMPLETED'],
            },
            OR: [
                {
                    AND: [
                        { startAt: { lte: startDateTime } },
                        { endAt: { gt: startDateTime } },
                    ],
                },
                {
                    AND: [
                        { startAt: { lt: endDateTime } },
                        { endAt: { gte: endDateTime } },
                    ],
                },
                {
                    AND: [
                        { startAt: { gte: startDateTime } },
                        { endAt: { lte: endDateTime } },
                    ],
                },
            ],
        },
    });

    if (overlappingBookings.length > 0) {
        throw {
            statusCode: 409,
            message: "Technician is not available at the requested time",
            code: "TECHNICIAN_NOT_AVAILABLE",
        };
    }

    // Create booking
    const booking = await prisma.booking.create({
        data: {
            customerId,
            technicianId,
            serviceId,
            price: service.price,
            startAt: startDateTime,
            endAt: endDateTime,
            bookingDate: bookingDateTime,
            status: BookingStatus.REQUESTED,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: true,
                },
            },
            payment: true,
            review: true,
        },
    });

    return booking;
};

/**
 * Get booking details by ID
 * GET /api/bookings/:id
 */
const getBookingDetails = async (bookingId: string) => {
    if (!bookingId) {
        throw new Error("bookingId is required")
    }
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        },
                    },
                },
            },
            service: {
                include: {
                    category: true,
                },
            },
            payment: {
                select: {
                    id: true,
                    price: true,
                    method: true,
                    status: true,
                    paidAt: true,
                    stripeCustomerId: true,
                    stripePaymentId: true,
                },
            },
            review: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    reviewDate: true,
                },
            },
        },
    });

    if (!booking) {
        throw {
            statusCode: 404,
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
        };
    }

    return booking;
};

/**
 * Check if booking can be cancelled
 */
const canCancelBooking = async (bookingId: string) => {

    if (!bookingId) {
        throw new Error("bookinId is required in params")
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            payment: true
        }
    });

    if (!booking) {
        throw {
            statusCode: 404,
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
        };
    }
   
    // Check if booking is in progress or completed
    if (booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') {
        return {
            canCancel: false,
            message: "Booking is already in progress or completed",
            reason: "IN_PROGRESS_OR_COMPLETED",
        };
    }

    // Check if booking is already cancelled
    if (booking.status === 'CANCELLED') {
        return {
            canCancel: false,
            message: "Booking is already cancelled",
            reason: "ALREADY_CANCELLED",
        };
    }

    // Check if booking is declined
    if (booking.status === 'DECLINED') {
        return {
            canCancel: false,
            message: "Booking has been declined",
            reason: "DECLINED",
        };
    }

    return {
        canCancel: true,
        message: "Booking can be cancelled",
    };
};
/**
 * Cancel booking (Customer only)
 * Customers can cancel at any point before it reaches IN_PROGRESS status
 * PATCH /api/bookings/:id/cancel
 */
const cancelBooking = async (userId: string, bookingId: string, payload: CancelBookingPayload) => {

    if (!bookingId) {
        throw new Error("bookinId is required in params")
    }
    const { cancelReason } = payload;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            payment: true,
        },
    });

    if (!booking) {
        throw {
            statusCode: 404,
            message: "Booking not found",
            code: "BOOKING_NOT_FOUND",
        };
    }

    // Check if customer owns this booking
    if (booking.customerId !== userId) {
        throw {
            statusCode: 403,
            message: "You are not authorized to pay for this booking",
            code: "UNAUTHORIZED_ACCESS",
        };
    }


    // Can only cancel before IN_PROGRESS
    if (booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') {
        throw {
            statusCode: 400,
            message: "Cannot cancel booking at this stage. Booking is already in progress or completed.",
            code: "CANCELLATION_NOT_ALLOWED",
        };
    }

    // Check if booking is already cancelled or declined
    if (booking.status === 'CANCELLED') {
        throw {
            statusCode: 400,
            message: "Booking is already cancelled",
            code: "BOOKING_ALREADY_CANCELLED",
        };
    }

    if (booking.status === 'DECLINED') {
        throw {
            statusCode: 400,
            message: "Booking has been declined by the technician and cannot be cancelled",
            code: "BOOKING_DECLINED",
        };
    }

    // If payment exists and is completed, process refund
    if (booking.payment && booking.payment.status === 'COMPLETED') {
        // TODO: Process refund via Stripe
        await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
                status: 'REFUNDED',
            },
        });
    }

    // Cancel booking
    const cancelledBooking = await prisma.booking.update({

        where: { id: bookingId },
        data: {
            status: BookingStatus.CANCELLED,
            cancelAt: new Date(),
            cancelReason: booking.cancelReason
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: true,
                },
            },
            payment: true,
            review: true,
        },
    });

    return cancelledBooking;
};



/**
 * Get booking statistics
 */
const getBookingStats = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (!user) {
        throw {
            statusCode: 404,
            message: "User not found",
            code: "USER_NOT_FOUND",
        };
    }

    const where: any = {};

    const [
        totalBookings,
        pendingBookings,
        acceptedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalSpent,
    ] = await Promise.all([
        prisma.booking.count({ where }),
        prisma.booking.count({ where: { ...where, status: 'REQUESTED' } }),
        prisma.booking.count({ where: { ...where, status: 'ACCEPTED' } }),
        prisma.booking.count({ where: { ...where, status: 'IN_PROGRESS' } }),
        prisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.booking.aggregate({
            where: { ...where, status: 'COMPLETED' },
            _sum: { price: true },
        }),
    ]);

    return {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalSpent: totalSpent._sum.price || 0,
        completionRate: totalBookings > 0
            ? Math.round((completedBookings / totalBookings) * 100)
            : 0,
    };
};

export const bookingService = {
    getUserOwnBookings,
    createBooking,
    getBookingDetails,
    cancelBooking,
    canCancelBooking,
    getBookingStats,
};