import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findMemberships = async () => {
  const result = await prisma.accountMembership.findMany();
  return result;
};

export const createMembership = async (content) => {
  const result = await prisma.accountMembership.create({ data: content });
  return result;
};

export const updateMembership = async ({ query, content }) => {
  const result = await prisma.accountMembership.updateMany({
    where: query,
    data: content,
  });
  return result;
};

export const findMyMemberships = async (userId) => {
  const result = await prisma.accountMembership.findMany({
    where: {
      userId: userId,
    },
  });
  return result;
};

export const findAccountMemberships = async (accountId) => {
  const result = await prisma.accountMembership.findMany({
    where: {
      accountId: accountId,
    },
  });
  return result;
};

export const deleteMembership = async (accountId, userId) => {
  const result = await prisma.accountMembership.deleteMany({
    where: {
      accountId: accountId,
      userId: userId,
    },
  });
  return result;
};

export const findMembership = async (accountId, userId) => {
  const result = await prisma.accountMembership.findMany({
    where: {
      accountId: accountId,
      userId: userId,
    },
  });
  return result;
};