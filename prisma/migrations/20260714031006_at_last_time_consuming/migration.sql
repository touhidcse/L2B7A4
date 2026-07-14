/*
  Warnings:

  - You are about to drop the column `createdAt` on the `availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `availabilities` table. All the data in the column will be lost.
  - Added the required column `price` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "reviwDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
