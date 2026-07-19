import { prisma } from "../../lib/prisma";
import stripe from "../../lib/stripe";
import { BookingStatus, PaymentStatus, PaymentMethod } from "../../../generated/prisma/enums";
import { ICreatePaymentPayload, IPaymentQuery } from "./payment.interface";
import { Prisma } from "../../../generated/prisma/client";
import { handleCheckoutSessionCompleted, handlePaymentFailed } from "../../utils/payment";
import config from "../../config";

/**
 * Create a Stripe checkout session for an accepted booking
 * POST /api/payments/create
 */
// It is not workign on production mode due to heavy load time greater than 5ms
// const createPaymentSession = async (customerId: string, payload: ICreatePaymentPayload) => {
//     const { bookingId } = payload;

//     // Validate required fields
//     if (!payload.bookingId) {
//         throw new Error ("Booking ID is required")
//     }

//     const transactionResult = await prisma.$transaction(async (tx) => {
//         // Get booking with customer and service details
//         const booking = await tx.booking.findUnique({
//             where: { id: bookingId },
//             include: {
//                 customer: {
//                     select: {
//                         id: true,
//                         name: true,
//                         email: true,
//                     },
//                 },
//                 service: {
//                     select: {
//                         id: true,
//                         title: true,
//                         description: true,
//                         price: true,
//                     },
//                 },
//                 technician: {
//                     include: {
//                         user: {
//                             select: {
//                                 id: true,
//                                 name: true,
//                                 email: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         if (!booking) {
//             throw {
//                 statusCode: 404,
//                 message: "Booking not found",
//                 code: "BOOKING_NOT_FOUND",
//             };
//         }

//         // Check if customer owns this booking
//         if (booking.customerId !== customerId) {
//             throw {
//                 statusCode: 403,
//                 message: "You are not authorized to pay for this booking",
//                 code: "UNAUTHORIZED_ACCESS",
//             };
//         }

//         // Check if booking is already paid
//         if (booking.status === 'PAID') {
//             throw {
//                 statusCode: 400,
//                 message: "Booking is already paid",
//                 code: "BOOKING_ALREADY_PAID",
//             };
//         }

//         // Check if booking is completed or cancelled or declined or In-progress
//         if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === "DECLINED" || booking.status === "IN_PROGRESS") {
//             throw {
//                 statusCode: 400,
//                 message: `Booking is ${booking.status.toLowerCase()} and cannot be paid`,
//                 code: "BOOKING_NOT_ACCEPTED",
//             };
//         }

//         // CRITICAL: Can only pay if booking status is ACCEPTED
//         if (booking.status !== 'ACCEPTED') {
//             throw {
//                 statusCode: 400,
//                 message: `Booking must be accepted before payment. Current status: ${booking.status}`,
//                 code: "BOOKING_NOT_ACCEPTED",
//             };
//         }

//         const user = await prisma.user.findFirstOrThrow({
//             where: {
//                 id: customerId
//             },
//             include:{
//                 payments: true
//             }
//         })

//         // old customer of FixItNowBackend

//         let stripeCustomerId = user.payments[0]?.stripeCustomerId

//         if (!stripeCustomerId) {

//             //new customer of FixItNowBackedn
//             const customer = await stripe.customers.create({
//                 email: user.email,
//                 name: user.name,
//                 metadata: { userId: user.id }
//             })

//             stripeCustomerId = customer.id;
//         }

//         // Create Stripe Checkout Session
//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: booking.service.title,
//                         },
//                         unit_amount: booking.price * 100,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             success_url: `${config.app_url}/premium?success=true`,
//             cancel_url: `${config.app_url}/payment?success=false`,
//             customer_email: booking.customer.email,
//             metadata: {
//                 bookingId: booking.id,
//                 customerId: booking.customerId,
//                 technicianId: booking.technicianId,
//             },
//         });

//         // Create payment record
//         const payment = await tx.payment.create({
//             data: {
//                 bookingId: booking.id,
//                 customerId: booking.customerId,
//                 price: booking.service.price,
//                 method: PaymentMethod.STRIPE,
//                 status: PaymentStatus.PENDING,
//                 stripeCustomerId: stripeCustomerId,
//                 stripePaymentId: session.id,
//             },
//             include: {
//                 customer: {
//                     select: {
//                         id: true,
//                         name: true,
//                         email: true,
//                     },
//                 },
//                 booking: {
//                     include: {
//                         service: true,
//                         technician: {
//                             include: {
//                                 user: {
//                                     select: {
//                                         id: true,
//                                         name: true,
//                                         email: true,
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//         return {
//             sessionId: session.id,
//             checkoutUrl: session.url,
//             payment,
//         };
//     });
//     return transactionResult;
// };

const createPaymentSession = async (
  customerId: string,
  payload: ICreatePaymentPayload
) => {
  const { bookingId } = payload;

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  // 1. Booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      technicianId: true,
      status: true,
      price: true,

      customer: {
        select: {
          email: true,
        },
      },

      service: {
        select: {
          title: true,
          price: true,
        },
      },
    },
  });

  if (!booking) {
    throw {
      statusCode: 404,
      message: "Booking not found",
    };
  }

  if (booking.customerId !== customerId) {
    throw {
      statusCode: 403,
      message: "Unauthorized",
    };
  }

  if (booking.status === BookingStatus.PAID) {
    throw {
      statusCode: 400,
      message: "Booking already paid",
    };
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw {
      statusCode: 400,
      message: `Booking must be ACCEPTED. Current status: ${booking.status}`,
    };
  }

  // 2. User
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: customerId,
    },
    select: {
      id: true,
      name: true,
      email: true,

      payments: {
        select: {
          stripeCustomerId: true,
        },
        take: 1,
      },
    },
  });

  // 3. Stripe Customer
  let stripeCustomerId = user.payments[0]?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    stripeCustomerId = customer.id;
  }

  // 4. Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    customer: stripeCustomerId,

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(booking.price * 100),

          product_data: {
            name: booking.service.title,
          },
        },
      },
    ],

    success_url: `${config.app_url}/premium?success=true`,
    cancel_url: `${config.app_url}/payment?success=false`,

    metadata: {
      bookingId: booking.id,
      customerId,
      technicianId: booking.technicianId,
    },
  });

  // 5. Transaction (ONLY DB)
  const payment = await prisma.$transaction(async (tx) => {
    return tx.payment.create({
      data: {
        bookingId: booking.id,
        customerId,
        price: booking.service.price,

        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,

        stripeCustomerId,
        stripePaymentId: session.id,
      },
    });
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
    payment,
  };
};



/**
 * Handle Stripe Webhook
 */
const handleWebhook = async (payload: Buffer, signature: string) => {

    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    )

    let result;

    switch (event.type) {
        case 'checkout.session.completed':
            result = await handleCheckoutSessionCompleted(event.data.object);
            break;

        case 'checkout.session.async_payment_succeeded':
            result = await handleCheckoutSessionCompleted(event.data.object);
            break;

        case 'checkout.session.async_payment_failed':
            result = await handlePaymentFailed(event.data.object);
            break;

        case 'payment_intent.payment_failed':
            result = await handlePaymentFailed(event.data.object);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
            result = { received: true, type: event.type };
    }
    return result;


};
/**
 * Get user's payment history
 * GET /api/payments
 */
const getPaymentHistory = async (userId: string, query: IPaymentQuery) => {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "paidAt";
    const sortOrder = query.sortOrder || "desc";

    const andCondition: Prisma.PaymentWhereInput[] = [
        { customerId: userId },
    ];

    if (query.status) {
        andCondition.push({ status: query.status });
    }

    if (query.method) {
        andCondition.push({ method: query.method });
    }

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where: {
                AND: andCondition,
            },
            include: {
                booking: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                title: true,
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
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            take: limit,
            skip: skip,
        }),
        prisma.payment.count({
            where: {
                AND: andCondition,
            },
        }),
    ]);

    return {
        data: payments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get payment details by ID
 * GET /api/payments/:id
 */
const getPaymentDetails = async (userId: string, paymentId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            booking: {
                include: {
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
                                    phone: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!payment) {
        throw {
            statusCode: 404,
            message: "Payment not found",
            code: "PAYMENT_NOT_FOUND",
        };
    }

    return payment;
};

export const paymentService = {
    createPaymentSession,
    handleWebhook,
    getPaymentHistory,
    getPaymentDetails,
};