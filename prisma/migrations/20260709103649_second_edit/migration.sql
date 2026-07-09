/*
  Warnings:

  - You are about to drop the column `latitude` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `technician_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "refreshToken";
