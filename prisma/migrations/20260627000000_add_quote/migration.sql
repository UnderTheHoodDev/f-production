-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'RESPONDED');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(14,0) NOT NULL,
    "discount" DECIMAL(14,0) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 8,
    "taxAmount" DECIMAL(14,0) NOT NULL,
    "total" DECIMAL(14,0) NOT NULL,
    "issueDate" DATE NOT NULL,
    "validUntil" DATE,
    "content" JSONB NOT NULL,
    "customerFeedback" TEXT,
    "feedbackComment" TEXT,
    "respondedAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "respondentIp" TEXT,
    "representativeKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_seq_key" ON "Quote"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_token_key" ON "Quote"("token");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");
