/*
  Warnings:

  - Added the required column `value` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `Income` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;
