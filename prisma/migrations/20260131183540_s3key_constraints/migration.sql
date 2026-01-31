/*
  Warnings:

  - A unique constraint covering the columns `[s3Key]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Made the column `s3Key` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "s3Key" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_s3Key_key" ON "Image"("s3Key");

-- CreateIndex
CREATE INDEX "Image_s3Key_idx" ON "Image"("s3Key");
