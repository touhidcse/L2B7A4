import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import stripe from "../lib/stripe";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/enums";

/**
 * Handle successful payment
 */
export const handleCheckoutSessionCompleted = async ( session:any ) =>{

    console.log("Checkout Completed Session from paymet.ts.utils:",session.id);

    const bookingId = session.metadata?.bookingId;

    if(!bookingId){
        console.log("Booking ID missing in metadata");
        return;
    }

    // Find payment
    const payment = await prisma.payment.findFirst({
        where:{
            stripePaymentId: session.id
        }
    });

    if(!payment){

        console.log( "Payment record not found");
        return;
    }

    // Update payment status

    await prisma.payment.update({

        where:{
            id:payment.id
        },

        data:{
            status:PaymentStatus.COMPLETED,
            paidAt:new Date()
        }

    });


    // Update booking status

    await prisma.booking.update({

        where:{
            id:bookingId
        },

        data:{
            status:BookingStatus.PAID
        }

    });

    console.log(
        "Payment marked as PAID"
    );

    return {
        success:true,
        paymentId:payment.id
    };

};

/**
 * Handle failed payment
 */
export const handlePaymentFailed = async (session: any) => {
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
        throw {
            statusCode: 400,
            message: "Booking ID not found in session metadata",
            code: "BOOKING_ID_MISSING",
        };
    }

    // Update payment status
    const payment = await prisma.payment.update({
        where: { stripePaymentId: session.id },
        data: {
            status: PaymentStatus.FAILED,
        },
    });

    return {
        success: false,
        message: "Payment failed",
        payment,
    };
};
