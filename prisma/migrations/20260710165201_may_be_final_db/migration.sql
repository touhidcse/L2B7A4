/*
  Warnings:

  - You are about to drop the column `address` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bookingNumber` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationReason` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `failureReason` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentData` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIntentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `refundAmount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `refundedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `totalReviews` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `experience` to the `technician_profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `technician_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropIndex
DROP INDEX "bookings_bookingNumber_idx";

-- DropIndex
DROP INDEX "bookings_bookingNumber_key";

-- DropIndex
DROP INDEX "payments_transactionId_key";

-- DropIndex
DROP INDEX "payments_userId_idx";

-- DropIndex
DROP INDEX "services_isActive_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "address",
DROP COLUMN "bookingNumber",
DROP COLUMN "cancellationReason",
DROP COLUMN "cancelledAt",
DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "isPaid",
DROP COLUMN "location",
DROP COLUMN "notes",
DROP COLUMN "scheduledDate",
DROP COLUMN "scheduledTime",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
ADD COLUMN     "bookingDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "failureReason",
DROP COLUMN "paymentData",
DROP COLUMN "paymentIntentId",
DROP COLUMN "provider",
DROP COLUMN "refundAmount",
DROP COLUMN "refundedAt",
DROP COLUMN "stripeSessionId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "customerId" TEXT NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "comment" SET NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "createdAt",
DROP COLUMN "duration",
DROP COLUMN "image",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "availability",
DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "experienceYears",
DROP COLUMN "hourlyRate",
DROP COLUMN "isAvailable",
DROP COLUMN "location",
DROP COLUMN "skills",
DROP COLUMN "totalReviews",
DROP COLUMN "updatedAt",
ADD COLUMN     "experience" INTEGER NOT NULL,
ALTER COLUMN "rating" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
DROP COLUMN "profilePhoto",
ADD COLUMN     "isBan" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "profiles";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
