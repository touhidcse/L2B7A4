import { prisma } from "../../lib/prisma";
import { CreateCommentPayload } from "./review.interface";


const postReviewForCompletedBooking = async (customerId: string, bookingId: string, payload: CreateCommentPayload) => {

    if (!bookingId) {
        throw new Error("Booking Id required in params")
    }
    const { rating, comment } = payload;
    const transactionResult = await prisma.$transaction(async (tx) => {
        // Get booking with customer and service details
        const booking = await tx.booking.findUnique({
            where: { id: bookingId },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                service: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                    },
                },
                technician: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                review: true,
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
        if (booking.customerId !== customerId) {
            throw {
                statusCode: 403,
                message: "You are not authorized to pay for this booking",
                code: "UNAUTHORIZED_ACCESS",
            };
        }

        // Check if booking is in  requeste/cancelled / declined/accepted/paid/ In-progress state
        if (booking.status === "REQUESTED" || booking.status === "ACCEPTED" || booking.status === "DECLINED" || booking.status === 'CANCELLED' || booking.status === "PAID" || booking.status === "IN_PROGRESS") {
            throw new Error("Review can be given in a completed Booking!")
        }

        const createReview = await tx.review.create({
            data: {
                bookingId,
                customerId,
                technicianId: booking.technicianId,
                rating,
                comment
            }
        });
        return createReview;
    });

    return transactionResult;
}


export const reviewService = {
    postReviewForCompletedBooking
}