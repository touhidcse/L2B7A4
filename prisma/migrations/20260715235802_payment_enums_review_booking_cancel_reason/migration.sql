/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `reviwDate` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePaymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePaymentId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_stripeSubscriptionId_idx";

-- DropIndex
DROP INDEX "payments_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cancelReason" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "stripePaymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "reviwDate",
ADD COLUMN     "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentId_key" ON "payments"("stripePaymentId");

-- CreateIndex
CREATE INDEX "payments_stripePaymentId_idx" ON "payments"("stripePaymentId");
