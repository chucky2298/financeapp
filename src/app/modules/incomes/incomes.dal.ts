import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findIncomes = async () => {
  const result = await prisma.income.findMany();
  return result;
};

export const createIncome = async ( content ) => {
  const result = await prisma.income.create({ data: content });
  return result;
};

export const findIncome = async ({id}) => {
  const result = await prisma.income.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const findIncomesByAccount = async (id) => {
  const result = await prisma.income.findMany({
    where: {
      accountId: id,
    },
  });
  return result;
};

export const findIncomesByDate = async ({ accountId, year, month }) => {
  const result = await prisma.income.findMany({
    where: {
      accountId: accountId,
      month: month,
      year: year,
    },
  });
  return result;
};

export const updateIncome = async ({ query, content }) => {
	console.log("query: ", content)
  const result = await prisma.income.update({
    where: query,
    data: content,
  });
  return result;
};

export const deleteIncome = async ({ query }) => {
  await prisma.income.delete(query);
};

export const deleteIncomes = async ({ query }) => {
  await prisma.income.deleteMany(query);
};
