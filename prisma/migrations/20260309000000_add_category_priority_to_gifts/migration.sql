-- AlterTable
ALTER TABLE "gifts" ADD COLUMN "category" TEXT;
ALTER TABLE "gifts" ADD COLUMN "priority" BOOLEAN NOT NULL DEFAULT false;
