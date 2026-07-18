import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { ICreatePaymentPayload, IPaymentQuery } from "./payment.interface";

/**
 * Create a Stripe checkout session for an accepted booking
 * POST /api/payments/create
 */
const createPaymentSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload: ICreatePaymentPayload = req.body;

    const result = await paymentService.createPaymentSession(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "Payment session created successfully",
        data: result,
    });
});

/**
 * Handle Stripe Webhook
 * POST /api/payments/confirm
 */
const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['stripe-signature']! as string;
    const event = req.body as Buffer;
    const result = await paymentService.handleWebhook(event, signature);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Webhook processed successfully",
        data: result,
    });
});

/**
 * Get user's payment history
 * GET /api/payments
 */
const getPaymentHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const query: IPaymentQuery = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: req.query.sortBy as string || "paidAt",
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || "desc",
        status: req.query.status as any,
        method: req.query.method as any,
    };

    const result = await paymentService.getPaymentHistory(userId, query);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Payment history retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Get payment details by ID
 * GET /api/payments/:id
 */
const getPaymentDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return sendResponse(res, {
            success: false,
            statusCode: httpstatus.BAD_REQUEST,
            message: "Invalid payment ID",
            data: null,
        });
    }

    const payment = await paymentService.getPaymentDetails(userId, id);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Payment details retrieved successfully",
        data: payment,
    });
});

export const paymentController = {
    createPaymentSession,
    handleWebhook,
    getPaymentHistory,
    getPaymentDetails,
};