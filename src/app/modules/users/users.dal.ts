import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const findUserById = async (id) => {
  console.log(id);
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const updateUserById = async ({ query, content }) => {
  const result = await prisma.user.update({
    where: query,
    data: content,
  });
  return result;
};

export const deleteUser = async ({ query }) => {
  await prisma.user.delete(query);
};

export const deleteUsers = async ({ query }) => {
  await prisma.user.deleteMany(query);
};
