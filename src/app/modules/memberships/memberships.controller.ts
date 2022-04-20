import * as service from "./memberships.service";

export const getMemberships = async (req, res, next) => {
		try {
			const result = await service.readMemberships({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postMembership = async (req, res, next) => {
  try {
    const result = await service.createMembership({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
export const acceptInvitation = async (req, res, next) => {
  try {
    const result = await service.acceptInvitation({
      token: req.query.token,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getMyMemberships = async (req, res, next) => {
		try {
			const result = await service.readMyMemberships({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAccountMemberships = async (req, res, next) => {
		try {
			const result = await service.readAccountMemberships({
        user: req.user,
        accountId: req.params.id,
      });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const deleteMembership = async (req, res, next) => {
  try {
    await service.deleteMemberships({
      user: req.user,
      accountId: req.params.accountId,
      userId: req.params.userId,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const assignManager = async (req, res, next) => {
  try {
    await service.assignManager({
      user: req.user,
      accountId: req.params.accountId,
      userId: req.params.userId,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
