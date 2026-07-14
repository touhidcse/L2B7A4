/*
  Warnings:

  - You are about to drop the column `name` on the `categories` table. All the data in the column will be lost.
  - Made the column `day` on table `availabilities` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "categories_name_idx";

-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "availabilities" ALTER COLUMN "day" SET NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name",
ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "categories"("type");
