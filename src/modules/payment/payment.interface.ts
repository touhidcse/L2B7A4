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

export interface IStripeSessionResponse {
    sessionId: string;
    checkoutUrl: string;
    paymentId: string;
}

export interface IPaymentResponse {
    bookingId: string;
    price: number;
    method: PaymentMethod;
    status: PaymentStatus;
    stripePaymentId: string;
    paidAt?: Date;
    cancelAt?: Date;
    cancelReason?: string;
    customer?: {
        id: string;
        name: string;
        email: string;
    };
    booking?: {
        id: string;
        status: string;
        service: {
            title: string;
            price: number;
        };
        technician: {
            user: {
                name: string;
                email: string;
            };
        };
    };
}