import * as service from "./users.service";

export const getUsers = async (req, res, next) => {
  try {
    const result = await service.readUsers({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const result = await service.readOneUser({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const patchUser = async (req, res, next) => {
  try {
    await service.updateUser({
      user: req.user,
      requestBody: req.body,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

