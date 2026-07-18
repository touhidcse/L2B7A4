# FixItNow Backend 🚀

FixItNow is a home service marketplace backend API where customers can find professional technicians, book services, make payments, and review completed services.

This backend provides secure authentication, role-based authorization, service management, booking management, payment processing, and review systems.

---

## Backend Github Repo
   https://github.com/touhidcse/L2B7A4

---

### Live API URL


---

### API Documentation Postman
    https://github.com/touhidcse/L2B7A4/blob/main/L2B7A4-%20FixItNow.postman_collection.json 

---
### Demo Vidio


---

### Admin Credentials
- Admin Email: admin@fixitnow.com
- Admin Password: 1A2D3M4I5n@#6

## 🌟 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control
- Secure password hashing using bcrypt
- Protected API routes

### User Management
- Customer management
- Technician management
- Admin management
- User ban/unban system

### Technician Features
- Create technician profile
- Update profile information
- Add services
- Manage availability schedule
- View bookings
- Manage service requests

### Service Management
- Create and manage services
- Service categories
- Search services by category
- Technician-based services

### Booking System
- Customer can book services
- Technician can accept/decline bookings
- Booking status tracking by customer

### Booking statuses:
- REQUESTED
- ACCEPTED
- DECLINED
- PAID
- CANCELLED
- IN_PROGRESS
- COMPLETED


### Payment System
- Stripe payment integration
- Payment status tracking
- Payment history

### Payment status:
- PENDING
- COMPLETED
- FAILED
- REFUNDED


### Review System
- Customer can review completed bookings
- Technician ratings
- Review management

---

# 🛠️ Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL

## ORM

- Prisma ORM

## Authentication

- JWT
- bcrypt

## Payment

- Stripe API

## Development Tools

- tsx
- ESLint
- Postman

---

# 📁 Project Structure
src
│
├── app.ts
├── server.ts
│
├── config
│ ├── env.ts
│ └── prisma.ts
│
├── middlewares
│ ├── auth.ts
│ ├── globalErrorHandler.ts
│ └── notFound.ts
│
├── modules
│ │
│ ├── admin
│ ├── auth
│ ├── booking
│ ├── category
│ ├── payment
│ ├── review
│ ├── service
│ ├── technician
│ └── user 
│
│
├── utils
| │
│ ├── catchAsync
│ ├── jwt
│ ├── payment
│ ├── sendResponse

👤 Default Login Credentials

### Admin
Email:
admin2fixitnow.xom
Password: 1A2D3M4I5n@#6

### Technician
- Example:

- Email:
- level1@programminghero.com
- Password:
- 1234546
### Customer
- Example:
- Email:
- level8@programminghero.com
- Password:
- 1234546