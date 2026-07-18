import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors"
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { adminRoutes } from "./modules/admin/admin.route";
import { serviceRoutes } from "./modules/service/service.route";
import { technicianRoutes } from "./modules/technician/technician.route";
import { catergoryRoutes } from "./modules/category/category.route";
import { bookingRoutes } from "./modules/booking/booking.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { reviewRoutes } from "./modules/review/review.route";



const app : Application = express()


app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(
    "/api/payments/confirm",
    express.raw({ type: "application/json" })
)


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser()) 

app.get("/", (req : Request,res: Response)=>{
    res.send("Hellow World")
})


app.use("/api/payments", paymentRoutes)
app.use("/api/users",userRoutes)

app.use("/api/auth", authRoutes)

//Public
app.use("/api/services", serviceRoutes)

app.use("/api/categories", catergoryRoutes)

// Public
app.use("/api/technicians", technicianRoutes)


//Booking By Customer

app.use("/api/bookings", bookingRoutes)

//only technican
app.use("/api/technician", technicianRoutes)

// customer only
app.use("/api/reviews" ,auth(Role.CUSTOMER) , reviewRoutes),

//Admin
app.use("/api/admin", adminRoutes)




app.use(notFound)

app.use(globalErrorHandler)

export default app;
