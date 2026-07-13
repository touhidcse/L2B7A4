
// import { PrismaClient, Role, BookingStatus, PaymentMethod, PaymentStatus } from "../../generated/prisma/client"
// import bcrypt from 'bcryptjs';
// import { prisma } from '../../src/lib/prisma';



// async function main() {

//   const password = await bcrypt.hash("1A2D3M4I5n@#6", 10);

//   // ==========================
//   // Admin
//   // ==========================

//   const admin = await prisma.user.create({
//     data: {
//       name: "Admin",
//       email: "admin@fixitnow.com",
//       password,
//       role: Role.ADMIN,
//     },
//   });

//   // ==========================
//   // Customer
//   // ==========================

//   const customer = await prisma.user.create({
//     data: {
//       name: "John Doe",
//       email: "customer@gmail.com",
//       password,
//       phone: "01711111111",
//       address: "Dhaka",
//       role: Role.CUSTOMER,
//     },
//   });

//   // ==========================
//   // Technician User
//   // ==========================

//   const technicianUser = await prisma.user.create({
//     data: {
//       name: "Rahim Electric",
//       email: "technician@gmail.com",
//       password,
//       phone: "01822222222",
//       address: "Dhaka",
//       role: Role.TECHNICIAN,
//     },
//   });

//   // ==========================
//   // Technician Profile
//   // ==========================

//   const technician = await prisma.technicianProfile.create({
//     data: {
//       userId: technicianUser.id,
//       experience: 6,
//       bio: "Professional electrician",
//       rating: 4.8,
//     },
//   });

//   // ==========================
//   // Categories
//   // ==========================

//   const electrical = await prisma.category.create({
//     data: {
//       name: "Electrical",
//     },
//   });

//   const plumbing = await prisma.category.create({
//     data: {
//       name: "Plumbing",
//     },
//   });

//   // ==========================
//   // Services
//   // ==========================

//   const service = await prisma.service.create({
//     data: {
//       title: "Home Electrical Repair",
//       description: "Repair switches, fans and wiring",
//       price: 1500,
//       technicianId: technician.id,
//       categoryId: electrical.id,
//     },
//   });

//   // ==========================
//   // Booking
//   // ==========================

//   const booking = await prisma.booking.create({
//     data: {
//       customerId: customer.id,
//       technicianId: technician.id,
//       serviceId: service.id,
//       bookingDate: new Date(),
//       status: BookingStatus.COMPLETED,
//     },
//   });

//   // ==========================
//   // Payment
//   // ==========================

//   await prisma.payment.create({
//     data: {
//       bookingId: booking.id,
//       customerId: customer.id,
//       amount: 1500,
//       method: PaymentMethod.STRIPE,
//       status: PaymentStatus.COMPLETED,
//       transactionId: "TXN-10001",
//       paidAt: new Date(),
//     },
//   });

//   // ==========================
//   // Review
//   // ==========================

//   await prisma.review.create({
//     data: {
//       bookingId: booking.id,
//       customerId: customer.id,
//       technicianId: technician.id,
//       rating: 5,
//       comment: "Excellent service. Highly recommended!",
//     },
//   });

//   console.log("🌱 Database seeded successfully.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });