-- CreateEnum
CREATE TYPE "Category" AS ENUM ('HOUSE', 'TRANSPORT', 'PERSONAL', 'FOOD', 'ENTERTAINMENT', 'HEALTH');

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "category" "Category" NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
