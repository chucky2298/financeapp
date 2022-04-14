/*
  Warnings:

  - You are about to drop the `Secret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorAuth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Secret" DROP CONSTRAINT "Secret_twoFactorAuthId_fkey";

-- DropForeignKey
ALTER TABLE "TwoFactorAuth" DROP CONSTRAINT "TwoFactorAuth_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorAuth" JSONB;

-- DropTable
DROP TABLE "Secret";

-- DropTable
DROP TABLE "TwoFactorAuth";
