import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";

export interface ICreatePaymentPayload {
    bookingId: string;
    successUrl: string;
    cancelUrl: string;
}

export interface IPaymentQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PaymentStatus;
    method?: PaymentMethod;
}