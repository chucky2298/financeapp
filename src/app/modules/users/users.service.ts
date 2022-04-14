import * as validator from './users.validator';
import * as dal from './users.dal';
import { authorizeWriteRequest, checkIfFullyAuthenticated } from '../../utils/authorizations';



export const readUsers = async ({ user }) => {
	checkIfFullyAuthenticated(user.isFullyAuthenticated);
  authorizeWriteRequest({ user });
  const users = await dal.findUsers();
  return users;
};


export const readOneUser = async ({ user }) => {
	checkIfFullyAuthenticated(user.isFullyAuthenticated);
	const profile = await dal.findUserById(user._id);
  return profile;
};


export const updateUser = async ({ user, requestBody }) => {
	checkIfFullyAuthenticated(user.isFullyAuthenticated);
  validator.validatePatchAuthorRequest({ input: requestBody });

  await dal.updateUserById({
    query: { id: user._id },
    content: requestBody,
  });
};
