/*
  Warnings:

  - You are about to drop the column `discountApplied` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `finalAmount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "discountApplied",
DROP COLUMN "finalAmount";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "images",
DROP COLUMN "isVerified";
