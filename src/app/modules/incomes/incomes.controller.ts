import * as service from "./incomes.service";

export const getIncomes = async (req, res, next) => {
		try {
			const result = await service.readIncomes({ user: req.user });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const postIncome = async (req, res, next) => {
  try {
    const result = await service.createIncome({
      requestBody: req.body,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const updateIncome = async (req, res, next) => {
	console.log("§§§§§§§§§§§§§§§§§§§§§§§§§§§§ ", req.query.id);
  try {
    await service.updateIncome({
      requestBody: req.body,
      user: req.user,
			incomeId: req.query.id
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const deleteIncome = async (req, res, next) => {
  try {
    await service.deleteIncome({
      incomeId: req.query.id,
      user: req.user,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const getIncomesByAccount = async (req, res, next) => {
  try {
    const result = await service.readAccountIncomes({
      accountId: req.query.id,
      user: req.user,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

