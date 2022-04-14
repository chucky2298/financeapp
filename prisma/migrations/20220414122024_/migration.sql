-- DropForeignKey
ALTER TABLE "AccountMembership" DROP CONSTRAINT "AccountMembership_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountMembership" DROP CONSTRAINT "AccountMembership_userId_fkey";

-- AddForeignKey
ALTER TABLE "AccountMembership" ADD CONSTRAINT "AccountMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountMembership" ADD CONSTRAINT "AccountMembership_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
