import * as service from "./accounts.service";

export const getAccounts = async (req, res, next) => {
	console.log("Controller get accounts", req.user)
		try {
			const result = await service.readAccounts({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postAccount = async (req, res, next) => {
  try {
    const result = await service.createAccount({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

