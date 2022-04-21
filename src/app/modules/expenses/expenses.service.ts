import * as validator from "./expenses.validator";
import * as dal from "./expenses.dal";
import * as membershipDal from "../memberships/memberships.dal";
import * as accountDal from "../accounts/accounts.dal";
import { checkIfFullyAuthenticated } from "../../utils/authorizations";
import {
  NotAuthorized,
  NotFound,
} from "../../utils/error";

export const readExpenses = async ({ user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  const Expenses = await dal.findExpenses();
  return Expenses;
};

export const createExpense = async ({ requestBody, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePostExpenseRequest({ input: requestBody });

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

  const Expense = {
    accountId: requestBody.accountId,
    month: requestBody.month,
    year: requestBody.year,
    value: requestBody.value,
    description: requestBody.description,
    category: requestBody.category,
  };
  const createdExpense = await dal.createExpense(Expense);
  return createdExpense;
};

export const updateExpense = async ({ user, requestBody, ExpenseId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePatchExpenseRequest({ input: requestBody });

  const ExpenseFound = await dal.findExpense({
    id: Number(ExpenseId),
  });
  if (!ExpenseFound) {
    throw new NotFound("This Expense doesn't exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(ExpenseFound.accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  await dal.updateExpense({
    query: {
      id: Number(ExpenseId),
    },
    content: {
      value: requestBody.value,
      description: requestBody.description,
      category: requestBody.category,
    },
  });
};

export const readAccountExpenses = async ({ user, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

	const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const Expenses = await dal.findExpensesByAccount(Number(accountId));
  return Expenses;
};

export const deleteExpense = async ({ user, ExpenseId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const ExpenseFound = await dal.findExpense({
    id: Number(ExpenseId),
  });
  if (!ExpenseFound) {
    throw new NotFound("This Expense doesn't exist");
  }

  await dal.deleteExpense({ query: { where: { id: Number(ExpenseId) } } });
};
