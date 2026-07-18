import { BookingStatus } from "../../../generated/prisma/enums";

export interface CreateBookingPayload {
    technicianId: string;
    serviceId: string;
    startAt: string;
    endAt: string;
    bookingDate?: string;
}

export interface UpdateBookingStatusPayload {
    status: BookingStatus;
}

export interface CancelBookingPayload {
    cancelReason?: string;
}
