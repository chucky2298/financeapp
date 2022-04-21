import * as service from "./expenses.service";

export const getExpenses = async (req, res, next) => {
		try {
			const result = await service.readExpenses({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postExpense = async (req, res, next) => {
  try {
    const result = await service.createExpense({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    await service.updateExpense({
      requestBody: req.body,
      user: req.user,
			ExpenseId: req.query.id
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await service.deleteExpense({
      ExpenseId: req.query.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const getExpensesByAccount = async (req, res, next) => {
  try {
    const result = await service.readAccountExpenses({
      accountId: req.query.id,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

