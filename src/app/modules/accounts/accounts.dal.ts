import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAccounts = async () => {
  const result = await prisma.account.findMany();
  return result;
};

export const createAccount = async ( content ) => {
	console.log("Content ==============> ", content);
  const result = await prisma.account.create({ data: content });
  return result;
};

export const findAccount = async (name) => {
  const result = await prisma.account.findUnique({
    where: {
      name: name,
    },
  });
  return result;
};

export const findAccountById = async (id) => {
  const result = await prisma.account.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const deleteAccounts = async ({ query }) => {
  await prisma.account.deleteMany(query);
};