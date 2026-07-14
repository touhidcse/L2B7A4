import { DayOfWeek } from "../../../generated/prisma/enums";

export interface UpdateTechnicianProfilePayload {
    profilePhoto?: string;
    bio?: string;
    location?: string;
    experience?: number;
}

export interface UpdateAvailabilityPayload {
    day: DayOfWeek;
    startTime?: string;
    endTime?: string;
    isAvailable: boolean;
}

export interface UpdateBookingStatusPayload {
    status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TechnicianBookingResponse {
    id: string;
    bookingDate: Date;
    startAt: Date;
    endAt: Date;
    status: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        address: string | null;
    };
    service: {
        id: string;
        title: string;
        description: string;
        price: number;
        category: {
            id: string;
            name: string;
        };
    };
    payment: {
        id: string;
        amount: number;
        method: string;
        status: string;
        paidAt: Date | null;
    } | null;
    review: {
        id: string;
        rating: number;
        comment: string;
    } | null;
}