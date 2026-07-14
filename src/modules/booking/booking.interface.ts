import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBookingQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: BookingStatus;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
    customerId?: string;
    technicianId?: string;
    minPrice?: number;
    maxPrice?: number;
}

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
    reason?: string;
}

export interface IBookingResponse {
    id: string;
    customerId: string;
    technicianId: string;
    serviceId: string;
    price: number;
    status: BookingStatus;
    bookingDate: Date;
    startAt: Date;
    endAt: Date;
    cancelAt?: Date;
    customer?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
    technician?: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone?: string;
            profilePhoto?: string;
        };
    };
    service?: {
        id: string;
        title: string;
        description: string;
        price: number;
        category: {
            id: string;
            type: string;
        };
    };
    payment?: {
        id: string;
        price: number;
        method: string;
        status: string;
        paidAt?: Date;
        stripeSubscriptionId?: string;
    };
    review?: {
        id: string;
        rating: number;
        comment: string;
        reviwDate: Date;
    };
}