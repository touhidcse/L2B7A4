/*
  Warnings:

  - You are about to drop the `abailabilities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endAt` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "abailabilities" DROP CONSTRAINT "abailabilities_technicianId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "abailabilities";

-- CreateTable
CREATE TABLE "availabilities" (
    "id" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "day" "DayOfWeek",
    "startTime" TEXT,
    "endTime" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
