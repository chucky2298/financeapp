import Bcrypt from "bcryptjs";
import Crypto from "crypto";
import { stub } from "sinon";
import * as validator from "./auth.validator";
import * as dal from "./auth.dal";
import * as helpers from "./auth.helpers";
import * as twoFactorAuth from "../../config/authentication/two_factor_auth";
import errors from "../../constants/errors";
import confirmationLevels from "../../constants/confirmation_levels";
import { createToken } from "../../config/authentication/jwt";
import {
  NotAuthenticated,
  NotFound,
  UnprocessableEntity,
} from "../../utils/error";
import { Prisma } from "@prisma/client";
import mailService from "../../config/mail";

export const registerUser = async ({ requestBody }) => {
  validator.validateUserSignUpRequest({ input: requestBody });

  const userWithTheSameEmail = await dal.findUser(
    requestBody.email.toLowerCase()
  );

  if (userWithTheSameEmail) {
    throw new UnprocessableEntity(errors.DUPLICATE_EMAILS);
  }

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const newUserBody = {
    email: requestBody.email.toLowerCase(),
    password: hashedPassword,
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    confirmationToken: Crypto.randomBytes(32).toString("hex"),
    confirmationLevel: confirmationLevels.PENDING,
    isAdmin: true,
    twoFactorAuth: { active: false, secret: null },
  };
  const createdUser = await dal.createUser({ content: newUserBody });

  helpers.sendConfirmationEmail({
    user: createdUser,
    redirectUrl: requestBody.redirectUrl,
  });
  console.log(createdUser);
  return createdUser;
};

export const resendConfirmationEmail = async ({ requestBody }) => {
  validator.validateResendConfirmationEmailRequest({ input: requestBody });
  stub(mailService, "sendEmail").resolves();
  const query = {
    confirmationLevel: confirmationLevels.PENDING,
    email: requestBody.email.toLowerCase(),
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString("hex"),
  };
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  if (!updatedUser) {
    throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  }

  await helpers.sendConfirmationEmail({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });

  return updatedUser;
};

export const confirmAccount = async ({ requestParams }) => {
  validator.validateConfirmAccountRequest({ input: requestParams });

  const query = {
    confirmationLevel: confirmationLevels.PENDING,
    confirmationToken: requestParams.token,
  };
  const update = {
    confirmationToken: Crypto.randomBytes(32).toString("hex"),
    confirmationLevel: confirmationLevels.CONFIRMED,
  };
	const user = await dal.findUserByToken(requestParams.token);
	console.log("User from confimation", user)

  if (!user) {
    throw new NotFound(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
  }
  const updatedUser = await dal.updateUser({
    query,
    content: update,
  });

  return updatedUser;
};

export const logIn = async ({ requestBody }) => {
  validator.validateLogInRequest({ input: requestBody });
  console.log(`hello ${requestBody}`);
  const user = await dal.findUser(requestBody.email.toLowerCase());
  console.log(`hello to user ${user}`);
  console.log(user);
  checkIfEmailExists(user);
  await checkIfPasswordsMatch(user.password, requestBody.password);
  checkIfUserAccountIsNotConfirmed(user.confirmationLevel);

  let sessionToken = createToken(user, false);
	const tfa = user.twoFactorAuth as Prisma.JsonObject;
  if (!tfa.active) {
    sessionToken = createToken(user, true);
  }
  const userWithToken = {
    email: user.email.toLowerCase(),
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    confirmationToken: user.confirmationToken,
    confirmationLevel: user.confirmationLevel,
    isAdmin: user.isAdmin,
    twoFactorAuth: user.twoFactorAuth,
    token: sessionToken,
		secret: null,
  };

  delete userWithToken.password;
  return userWithToken;
};

function checkIfEmailExists(user) {
  if (!user) {
    throw new NotAuthenticated(errors.USER_NOT_FOUND);
  }
}

async function checkIfPasswordsMatch(existingPassword, givenPassword) {
  const passwordsMatch = await Bcrypt.compare(givenPassword, existingPassword);

  if (!passwordsMatch) {
    throw new NotAuthenticated(errors.INVALID_PASSWORD);
  }
}

function checkIfUserAccountIsNotConfirmed(currentConfirmationLevel) {
  const accountNotConfirmed =
    currentConfirmationLevel === confirmationLevels.PENDING;

  if (accountNotConfirmed) {
    throw new NotAuthenticated(errors.ACCOUNT_NOT_CONFIRMED);
  }
}

export const requestNewPassword = async ({ requestBody }) => {
  validator.validateResetPasswordRequest({ input: requestBody });
  const confirmationToken = Crypto.randomBytes(32).toString("hex");
  const query = { email: requestBody.email.toLowerCase() };
  const update = { confirmationToken: confirmationToken };
  await dal.updateUser({
    query,
    content: update,
  });
  const updatedUser = await dal.findUser(requestBody.email.toLowerCase());
  checkIfUserAccountExists(updatedUser);
  await helpers.sendEmailWithResetPasswordLink({
    user: updatedUser,
    redirectUrl: requestBody.redirectUrl,
  });
};

function checkIfUserAccountExists(user) {
  if (!user) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }
}

function checkIfUserUpdatedAccountExists(rows) {
  if (rows.count == 0) {
    throw new NotFound(errors.USER_NOT_FOUND);
  }
}

export const resetPassword = async ({ requestBody }) => {
  validator.validatePasswordUpdateRequest({ input: requestBody });

  const salt = await Bcrypt.genSalt();
  const hashedPassword = await Bcrypt.hash(requestBody.password, salt);
  const query = { confirmationToken: requestBody.token };
  const update = { password: hashedPassword };
  const rows = await dal.updateUser({
    query,
    content: update,
  });
	console.log("Service update password", rows)
  checkIfUserUpdatedAccountExists(rows);
};

export const initTwoFactorAuthentication = async ({ userId }) => {
  const query = { id: userId };
  const user = await dal.findUserById(userId);
  console.log(user);
  checkIfUserAccountExists(user);

  const secret = twoFactorAuth.generateSecret(user.email);
  const qrCodeBase64 = await twoFactorAuth.generateQRCode(secret);
  await dal.updateUserById({
    query,
    content: { secret: secret },
  });

  return qrCodeBase64;
};

export const completeTwoFactorAuthentication = async ({
  userId,
  requestBody,
}) => {
  validator.validateCompleteTwoFactorAuthRequest({ input: requestBody });

  const token = requestBody.token;
  const query = { id: userId };
  const user = await dal.findUserById(userId);

  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsEnabled(user);
  checkIfTokenIsValid(user, token);

  const update = { twoFactorAuth: { active: true } };
  await dal.updateUserById({
    query,
    content: update,
  });
	
};

function checkIfTwoFactorAuthIsCompleted(token) {
  if (token) {
    throw new UnprocessableEntity("Already authenticated");
  }
}

function checkIfTwoFactorAuthIsEnabled(user) {
  if (!user.secret) {
    throw new UnprocessableEntity(errors.NO_2FA);
  }
}

function checkIfTokenIsValid(user, token) {
  const tokenIsNotValid = !twoFactorAuth.validateToken(user.secret, token);

  if (tokenIsNotValid) {
    throw new UnprocessableEntity(errors.INVALID_2FA_TOKEN);
  }
}

export const verifyTwoFactorAuthToken = async ({ userId, requestParams }) => {
  validator.validateVerifyTwoFactorAuthTokenRequest({ input: requestParams });

  const token = requestParams.token;
  const user = await dal.findUserById(userId);

  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsActivated(user);
  checkIfTokenIsValid(user, token);
};

export const completeTwoFactorAuthLogin = async ({ userr, requestParams }) => {
  validator.validateVerifyTwoFactorAuthTokenRequest({ input: requestParams });
	const query = { id: userr._id };
  const isFullyAuth = userr.isFullyAuthenticated;
  const token = requestParams.token;
	console.log("=======================",isFullyAuth)
  const user = await dal.findUserById(userr._id);
  checkIfUserAccountExists(user);
  checkIfTwoFactorAuthIsActivated(user);
	checkIfTwoFactorAuthIsCompleted(isFullyAuth);
  checkIfTokenIsValid(user, token);
	const sessionToken = createToken(user, true);
	const update = { token: sessionToken };
  await dal.updateUserById({
    query,
    content: update,
  });
	const userWithToken = {
    token: sessionToken,
  };
  return userWithToken;
};

function checkIfTwoFactorAuthIsActivated(user) {
  if (!user.twoFactorAuth.active) {
    throw new UnprocessableEntity(errors.NO_2FA);
  }
}