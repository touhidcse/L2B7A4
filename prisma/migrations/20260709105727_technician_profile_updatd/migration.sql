-- AlterTable
ALTER TABLE "technician_profiles" ADD COLUMN     "availability" JSONB,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "skills" TEXT[];
