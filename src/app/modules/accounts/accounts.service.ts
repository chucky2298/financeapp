import * as validator from "./accounts.validator";
import * as dal from "./accounts.dal";
import { UnprocessableEntity } from "../../utils/error";
import { checkIfFullyAuthenticated } from "../../utils/authorizations";

export const readAccounts = async ({ user }) => {
	console.log("service read accounts", user.isFullyAuthenticated)
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  const users = await dal.findAccounts();
  return users;
};

export const createAccount = async ({ requestBody, user }) => {
  validator.validatePostAccountRequest({ input: requestBody });
  const existingAccount = await dal.findAccount(requestBody.name);

  if (existingAccount) {
    throw new UnprocessableEntity("Account name exists");
  }
	const account = {
    name: requestBody.name,
    users: {
      create: [
        {
          isManager: true,
          user: {
            connect: {
              id: user._id,
            },
          },
        },
      ],
    },
  };
  const createdAccount = await dal.createAccount(account);
  return createdAccount;
};

