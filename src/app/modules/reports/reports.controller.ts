import * as service from "./reports.service";

export const generateMonthReport = async (req, res, next) => {
  try {
    await service.generateMonthReport({
      month: req.query.month,
      user: req.user,
      year: req.query.year,
      accountId: req.query.id,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const generateYearReport = async (req, res, next) => {
  try {
    await service.generateYearReport({
      user: req.user,
      year: req.query.year,
      accountId: req.query.id,
    });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};



