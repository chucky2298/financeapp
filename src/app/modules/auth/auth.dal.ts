import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUser = async (email) => {
  console.log(email);
  const result = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  console.log(result);
  return result;
};

export const findUserByToken = async (token) => {
  const result = await prisma.user.findUnique({
    where: { confirmationToken: token },
  });
  console.log(result);
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

export const createUser = async ({ content }) => {
  const result = await prisma.user.create({ data: content });
  return result;
};

export const updateUserById = async ({ query, content }) => {
  const result = await prisma.user.update({
    where: query,
    data: content,
  });
  return result;
};

export const updateUser = async ({ query, content }) => {
  const result = await prisma.user.updateMany({
    where: query,
    data: content,
  });
  return result;
};

export const deleteUsers = async ({ query }) => {
  await prisma.user.deleteMany(query);
};
