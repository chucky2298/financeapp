/*
  Warnings:

  - A unique constraint covering the columns `[confirmationToken]` on the table `AccountMembership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `confirmationToken` to the `AccountMembership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountMembership" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confirmationToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccountMembership_confirmationToken_key" ON "AccountMembership"("confirmationToken");
