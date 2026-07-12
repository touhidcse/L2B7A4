import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";


const router = Router();


router.post("/create", auth(Role.CUSTOMER), paymentController.createPaymentforAcceptedBooking);
router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirmPaymentforAcceptedBooking);
router.get


export const paymentRoutes = router;