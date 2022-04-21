import * as validator from "./budgets.validator";
import * as dal from "./budgets.dal";
import * as membershipDal from "../memberships/memberships.dal";
import * as accountDal from "../accounts/accounts.dal";
import { checkIfFullyAuthenticated } from "../../utils/authorizations";
import {
  NotAuthorized,
  NotFound,
  UnprocessableEntity,
} from "../../utils/error";

export const readBudgets = async ({ user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  const Budgets = await dal.findBudgets();
  return Budgets;
};

export const createBudget = async ({ requestBody, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePostBudgetRequest({ input: requestBody });

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

  const BudgetsFound = await dal.findBudgetsByDate({
    accountId: Number(requestBody.accountId),
    year: Number(requestBody.year),
    month: Number(requestBody.month),
  });
  if (BudgetsFound.length > 0) {
    throw new UnprocessableEntity(
      "This account has already a budget for this month"
    );
  }

  const Budget = {
    accountId: requestBody.accountId,
    month: requestBody.month,
    year: requestBody.year,
    value: requestBody.value,
  };
  const createdBudget = await dal.createBudget(Budget);
  return createdBudget;
};

export const updateBudget = async ({ user, requestBody, BudgetId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePatchBudgetRequest({ input: requestBody });

  const BudgetFound = await dal.findBudget({
    id: Number(BudgetId),
  });
  if (!BudgetFound) {
    throw new NotFound("This Budget doesn't exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(BudgetFound.accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  await dal.updateBudget({
    query: {
      id: Number(BudgetId),
    },
    content: {
      value: requestBody.value,
    },
  });
};

export const readAccountBudgets = async ({ user, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
	console.log("Budgets service ============ ", accountId)
	const existingAccount = await accountDal.findAccountById(Number(accountId));

  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const Budgets = await dal.findBudgetsByAccount(Number(accountId));
  return Budgets;
};

export const deleteBudget = async ({ user, BudgetId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const BudgetFound = await dal.findBudget({
    id: Number(BudgetId),
  });
  if (!BudgetFound) {
    throw new NotFound("This Budget doesn't exist");
  }

  await dal.deleteBudget({ query: { where: { id: Number(BudgetId) } } });
};
