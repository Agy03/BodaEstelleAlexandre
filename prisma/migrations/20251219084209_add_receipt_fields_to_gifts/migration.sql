-- AlterTable
ALTER TABLE "gifts" ADD COLUMN     "receiptStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "reservationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "reservedAt" TIMESTAMP(3);
