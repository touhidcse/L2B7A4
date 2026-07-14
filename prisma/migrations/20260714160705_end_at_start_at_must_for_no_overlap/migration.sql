/*
  Warnings:

  - Made the column `endAt` on table `bookings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startAt` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "endAt" SET NOT NULL,
ALTER COLUMN "startAt" SET NOT NULL;
