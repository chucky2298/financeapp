import * as dal from "./memberships.dal";
import * as accountDal from "../accounts/accounts.dal";
import * as userDal from "../users/users.dal";
import * as validator from "./memberships.validator";
import {
  authorizeWriteRequest,
  checkIfFullyAuthenticated,
} from "../../utils/authorizations";
import { NotAuthorized, NotFound, UnprocessableEntity } from "../../utils/error";

export const readMemberships = async ({ user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  authorizeWriteRequest({ user });
  const users = await dal.findMemberships();
  return users;
};

export const createMembership = async ({ requestBody, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePostMembershipRequest({ input: requestBody });

	const existingAccount = await accountDal.findAccountById(
    Number(requestBody.accountId)
  );
  if (!existingAccount) {
    throw new UnprocessableEntity("Account not found");
  }
  const existingUser = await userDal.findUserById(Number(requestBody.userId));
  if (!existingUser) {
    throw new UnprocessableEntity("User not found");
  }

	const membershipManager = await dal.findMembership(
    Number(requestBody.accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not the manager");
  } else {
    if (!membershipManager[0].isManager) {
      throw new NotAuthorized("You are not the manager");
    }
  }

  const membership = {
    accountId: requestBody.accountId,
    userId: requestBody.userId,
		isManager: false,
  };
  const createdAccount = await dal.createMembership(membership);
  return createdAccount;
};

export const readMyMemberships = async ({ user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);
  const users = await dal.findMyMemberships(user._id);
  return users;
};

export const readAccountMemberships = async ({ user, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new UnprocessableEntity("Account not found");
  }

  const users = await dal.findAccountMemberships(Number(accountId));
  return users;
};

export const deleteMemberships = async ({ user, userId, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new UnprocessableEntity("Account not found");
  }
  const existingUser = await userDal.findUserById(Number(userId));
  if (!existingUser) {
    throw new UnprocessableEntity("User not found");
  }

  const deleted = await dal.deleteMembership(Number(accountId), Number(userId));
  if (deleted.count == 0) {
    throw new NotFound("Membership not found");
  }
};

export const assignManager = async ({ user, userId, accountId }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new UnprocessableEntity("Account not found");
  }
  const existingUser = await userDal.findUserById(Number(userId));
  if (!existingUser) {
    throw new UnprocessableEntity("User not found");
  }

  const membershipManager = await dal.findMembership(
    Number(accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not the manager");
  } else {
    if (!membershipManager[0].isManager) {
      throw new NotAuthorized("You are not the manager");
    }
  }

  const membership = await dal.findMembership(
    Number(accountId),
    Number(userId)
  );
  if (membership.length == 0) {
    throw new UnprocessableEntity("This user is not part of this account");
  }

  await dal.updateMembership({
    query: { accountId: Number(accountId), userId: Number(userId) },
    content: {
      isManager: true,
    },
  });
};
