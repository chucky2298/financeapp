import { NotAuthorized } from "./error";

export const authorizeWriteRequest = ({ user }) => {
  if (!user.isAdmin) {
    throw new NotAuthorized();
  }
};


export const checkIfFullyAuthenticated = (isFullyAuth) => {
	console.log("checking on IsFullyAuth", isFullyAuth)
  if (!isFullyAuth) {
    throw new NotAuthorized("Not fully authenticated");
  }
};