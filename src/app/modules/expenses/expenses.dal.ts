import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findExpenses = async () => {
  const result = await prisma.expense.findMany();
  return result;
};

export const createExpense = async ( content ) => {
  const result = await prisma.expense.create({ data: content });
  return result;
};

export const findExpense = async ({id}) => {
  const result = await prisma.expense.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const findExpensesByAccount = async (id) => {
  const result = await prisma.expense.findMany({
    where: {
      accountId: id,
    },
  });
  return result;
};

export const findExpensesByDate = async ({ accountId, year, month }) => {
  const result = await prisma.expense.findMany({
    where: {
      accountId: accountId,
      month: month,
      year: year,
    },
  });
  return result;
};

export const findExpensesByDateAndCategory = async ({
  accountId,
  year,
  month,
  category,
}) => {
  const result = await prisma.expense.findMany({
    where: {
      accountId: accountId,
      month: month,
      year: year,
      category: category,
    },
  });
  return result;
};

export const findExpensesByYear = async ({ accountId, year }) => {
  const result = await prisma.expense.findMany({
    where: {
      accountId: accountId,
      year: year,
    },
  });
  return result;
};

export const findExpensesByYearAndCategory = async ({ accountId, year, category }) => {
  const result = await prisma.expense.findMany({
    where: {
      accountId: accountId,
      year: year,
      category: category,
    },
  });
  return result;
};

export const updateExpense = async ({ query, content }) => {
	console.log("query: ", content)
  const result = await prisma.expense.update({
    where: query,
    data: content,
  });
  return result;
};

export const deleteExpense = async ({ query }) => {
  await prisma.expense.delete(query);
};

export const deleteExpenses = async ({ query }) => {
  await prisma.expense.deleteMany(query);
};
