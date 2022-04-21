import * as validator from "./incomes.validator";
import * as dal from "./incomes.dal";
import * as membershipDal from "../memberships/memberships.dal";
import * as accountDal from "../accounts/accounts.dal";
import { checkIfFullyAuthenticated } from "../../utils/authorizations";
import {
  NotAuthorized,
  NotFound,
  UnprocessableEntity,
} from "../../utils/error";

export const readIncomes = async ({ user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  const incomes = await dal.findIncomes();
  return incomes;
};

export const createIncome = async ({ requestBody, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePostIncomeRequest({ input: requestBody });

	const existingAccount = await accountDal.findAccountById(
    Number(requestBody.accountId)
  );

  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(requestBody.accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  const incomesFound = await dal.findIncomesByDate({
    accountId: Number(requestBody.accountId),
    year: Number(requestBody.year),
    month: Number(requestBody.month),
  });
  if (incomesFound.length > 0) {
    throw new UnprocessableEntity(
      "This account has already an income for this month"
    );
  }

  const income = {
    accountId: requestBody.accountId,
    month: requestBody.month,
    year: requestBody.year,
    value: requestBody.value,
  };
  const createdIncome = await dal.createIncome(income);
  return createdIncome;
};

export const updateIncome = async ({ user, requestBody, incomeId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePatchIncomeRequest({ input: requestBody });

  const incomeFound = await dal.findIncome({
    id: Number(incomeId),
  });
  if (!incomeFound) {
    throw new NotFound("This income doesn't exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(incomeFound.accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  await dal.updateIncome({
    query: {
      id: Number(incomeId),
    },
    content: {
      value: requestBody.value,
    },
  });
};

export const readAccountIncomes = async ({ user, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
	console.log("incomes service ============ ", accountId)
	const existingAccount = await accountDal.findAccountById(Number(accountId));

  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const incomes = await dal.findIncomesByAccount(Number(accountId));
  return incomes;
};

export const deleteIncome = async ({ user, incomeId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const incomeFound = await dal.findIncome({
    id: Number(incomeId),
  });
  if (!incomeFound) {
    throw new NotFound("This income doesn't exist");
  }

  await dal.deleteIncome({ query: { where: { id: Number(incomeId) } } });
};
