/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_transactionId_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeSubscriptionId_key" ON "payments"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "payments_stripeSubscriptionId_idx" ON "payments"("stripeSubscriptionId");
