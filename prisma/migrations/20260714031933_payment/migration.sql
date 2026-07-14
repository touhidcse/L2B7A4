/*
  Warnings:

  - You are about to drop the column `amount` on the `payments` table. All the data in the column will be lost.
  - Added the required column `cancelAt` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cancelAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount",
ADD COLUMN     "cancelAt" TIMESTAMP(3),
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
