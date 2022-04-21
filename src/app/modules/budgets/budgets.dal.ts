import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findBudgets = async () => {
  const result = await prisma.budget.findMany();
  return result;
};

export const createBudget = async ( content ) => {
  const result = await prisma.budget.create({ data: content });
  return result;
};

export const findBudget = async ({id}) => {
  const result = await prisma.budget.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const findBudgetsByAccount = async (id) => {
  const result = await prisma.budget.findMany({
    where: {
      accountId: id,
    },
  });
  return result;
};

export const findBudgetsByDate = async ({ accountId, year, month }) => {
  const result = await prisma.budget.findMany({
    where: {
      accountId: accountId,
      month: month,
      year: year,
    },
  });
  return result;
};

export const updateBudget = async ({ query, content }) => {
	console.log("query: ", content)
  const result = await prisma.budget.update({
    where: query,
    data: content,
  });
  return result;
};

export const deleteBudget = async ({ query }) => {
  await prisma.budget.delete(query);
};

export const deleteBudgets = async ({ query }) => {
  await prisma.budget.deleteMany(query);
};
