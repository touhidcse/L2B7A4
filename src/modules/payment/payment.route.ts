import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import express from "express";

const router = Router();


// Customer only
router.post("/confirm", paymentController.handleWebhook);

router.post("/create", auth(Role.CUSTOMER), paymentController.createPaymentSession);

router.get("/",auth(Role.CUSTOMER), paymentController.getPaymentHistory);


router.get("/:id", auth(Role.CUSTOMER), paymentController.getPaymentDetails);

export const paymentRoutes = router;