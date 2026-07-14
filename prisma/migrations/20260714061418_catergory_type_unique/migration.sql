/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Made the column `type` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "type" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_type_key" ON "categories"("type");
