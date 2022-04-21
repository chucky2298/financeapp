import * as service from "./budgets.service";

export const getBudgets = async (req, res, next) => {
		try {
			const result = await service.readBudgets({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postBudget = async (req, res, next) => {
  try {
    const result = await service.createBudget({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const updateBudget = async (req, res, next) => {
	console.log("§§§§§§§§§§§§§§§§§§§§§§§§§§§§ ", req.query.id);
  try {
    await service.updateBudget({
      requestBody: req.body,
      user: req.user,
			BudgetId: req.query.id
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await service.deleteBudget({
      BudgetId: req.query.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const getBudgetsByAccount = async (req, res, next) => {
  try {
    const result = await service.readAccountBudgets({
      accountId: req.query.id,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

