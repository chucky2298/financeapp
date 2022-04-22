/* eslint-disable @typescript-eslint/no-var-requires */
import * as membershipDal from "../memberships/memberships.dal";
import * as accountDal from "../accounts/accounts.dal";
import * as expenseDal from "../expenses/expenses.dal";
import * as budgetDal from "../budgets/budgets.dal";
import * as incomeDal from "../incomes/incomes.dal";
import { checkIfFullyAuthenticated } from "../../utils/authorizations";
import { NotAuthorized, NotFound } from "../../utils/error";

export const generateMonthReport = async ({ month, year, accountId, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  const income = await incomeDal.findIncomesByDate({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
  });
  if (income.length == 0) {
    throw new NotFound("No income for this month");
  }

  const budget = await budgetDal.findBudgetsByDate({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
  });

  const expenses = await expenseDal.findExpensesByDate({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
  });

  console.log(income[0], budget[0], expenses[0]);

  let monthname = "January";
  const date = new Date(year, month - 1, 21); // 2020-06-21
  monthname = date.toLocaleString("en-us", { month: "long" });

  let totalexpenses = 0;
  expenses.forEach((expense) => {
    totalexpenses = totalexpenses + expense.value;
  });

  const personalExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "PERSONAL",
  });
  let personalExpensesValue = 0;
  personalExpenses.forEach((expense) => {
    personalExpensesValue = personalExpensesValue + expense.value;
  });
  const personalExpensesPercentage =
    (personalExpensesValue / totalexpenses) * 100;

  const healthExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "HEALTH",
  });
  let healthExpensesValue = 0;
  healthExpenses.forEach((expense) => {
    healthExpensesValue = healthExpensesValue + expense.value;
  });
  const healthExpensesPercentage = (healthExpensesValue / totalexpenses) * 100;

  const entertainmentExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "ENTERTAINMENT",
  });
  let entertainmentExpensesValue = 0;
  entertainmentExpenses.forEach((expense) => {
    entertainmentExpensesValue = entertainmentExpensesValue + expense.value;
  });
  const entertainmentExpensesPercentage =
    (entertainmentExpensesValue / totalexpenses) * 100;

  const houseExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "HOUSE",
  });
  let houseExpensesValue = 0;
  houseExpenses.forEach((expense) => {
    houseExpensesValue = houseExpensesValue + expense.value;
  });
  const houseExpensesPercentage = (houseExpensesValue / totalexpenses) * 100;

  const transportExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "TRANSPORT",
  });
  let transportExpensesValue = 0;
  transportExpenses.forEach((expense) => {
    transportExpensesValue = transportExpensesValue + expense.value;
  });
  const transportExpensesPercentage =
    (transportExpensesValue / totalexpenses) * 100;

  const foodExpenses = await expenseDal.findExpensesByDateAndCategory({
    accountId: Number(accountId),
    month: Number(month),
    year: Number(year),
    category: "FOOD",
  });
  let foodExpensesValue = 0;
  foodExpenses.forEach((expense) => {
    foodExpensesValue = foodExpensesValue + expense.value;
  });
  const foodExpensesPercentage = (foodExpensesValue / totalexpenses) * 100;

  const balance = income[0].value - budget[0].value - totalexpenses;

  const fonts = {
    Roboto: {
      normal: __dirname + "/public/fonts/Roboto-Regular.ttf",
      bold: __dirname + "/public/fonts/Roboto-Medium.ttf",
      italics: __dirname + "/public/fonts/Roboto-Italic.ttf",
      bolditalics: __dirname + "/public/fonts/Roboto-MediumItalic.ttf",
    },
  };

  const PdfPrinter = require("pdfmake");
  const printer = new PdfPrinter(fonts);
  const fs = require("fs");

  const docDefinition = {
    content: [
      {
        text: `Account: ${existingAccount.name}`,
        style: "header",
      },
      {
        text: `You can find below the financial report for the month of ${monthname} ${year}.`,
        style: "subheader",
      },
      {
        style: "tableExample",
        fillColor: "#eeffee",
        table: {
          widths: [120, 120, 120, 120],
          body: [
            ["Income", "Budget", "Total expenses", "balance"],
            [
              `${income[0].value} $`,
              `${budget[0].value} $`,
              `${totalexpenses} $`,
              `${balance} $`,
            ],
          ],
        },
        margin: [0, 20, 0, 20],
      },
      {
        text: `Details of your expenses`,
        style: "subheader",
      },
      {
        columns: [
          {
            width: 100,
            text: "House:",
          },
          {
            width: 50,
            text: `${houseExpensesValue} $`,
          },
          {
            width: houseExpensesPercentage * 4,
            fillColor: "#C39BD3",
            table: {
              widths: [houseExpensesPercentage * 4],
              body: [[`${houseExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Food:",
          },
          {
            width: 50,
            text: `${foodExpensesValue} $`,
          },
          {
            width: foodExpensesPercentage * 4,
            fillColor: "#FAD7A0",
            table: {
              widths: [foodExpensesPercentage * 4],
              body: [[`${foodExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Transport:",
          },
          {
            width: 50,
            text: `${transportExpensesValue} $`,
          },
          {
            width: transportExpensesPercentage * 4,
            fillColor: "#AED6F1",
            table: {
              widths: [transportExpensesPercentage * 4],
              body: [[`${transportExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Health:",
          },
          {
            width: 50,
            text: `${healthExpensesValue} $`,
          },
          {
            width: healthExpensesPercentage * 4,
            fillColor: "#ABEBC6",
            table: {
              widths: [healthExpensesPercentage * 4],
              body: [[`${healthExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Entertainment:",
          },
          {
            width: 50,
            text: `${entertainmentExpensesValue} $`,
          },
          {
            width: entertainmentExpensesPercentage * 4,
            fillColor: "#F5B7B1",
            table: {
              widths: [entertainmentExpensesPercentage * 4],
              body: [[`${entertainmentExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Personal:",
          },
          {
            width: 50,
            text: `${personalExpensesValue} $`,
          },
          {
            width: personalExpensesPercentage * 4,
            fillColor: "#AEB6BF",
            table: {
              widths: [personalExpensesPercentage * 4],
              body: [[`${personalExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 15],
      },
      tableExample: {
        margin: [0, 25, 25, 25],
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream("document.pdf"));
  pdfDoc.end();
};

export const generateYearReport = async ({ year, accountId, user }) => {
  checkIfFullyAuthenticated(user.isFullyAuthenticated);

  const existingAccount = await accountDal.findAccountById(Number(accountId));
  if (!existingAccount) {
    throw new NotFound("Account does not exist");
  }

  const membershipManager = await membershipDal.findMembership(
    Number(accountId),
    Number(user._id)
  );
  if (membershipManager.length == 0) {
    throw new NotAuthorized("You are not member of this account");
  }

  const income = await incomeDal.findIncomesByYear({
    accountId: Number(accountId),
    year: Number(year),
  });
  if (income.length == 0) {
    throw new NotFound("No incomes for this year");
  }

  const budget = await budgetDal.findBudgetsByYear({
    accountId: Number(accountId),
    year: Number(year),
  });

  const expenses = await expenseDal.findExpensesByYear({
    accountId: Number(accountId),
    year: Number(year),
  });

  console.log(income[0], budget[0], expenses[0]);

  let totalexpenses = 0;
  expenses.forEach((expense) => {
    totalexpenses = totalexpenses + expense.value;
  });

  let totalIncome = 0;
  income.forEach((expense) => {
    totalIncome = totalIncome + expense.value;
  });

  let totalBudget = 0;
  budget.forEach((expense) => {
    totalBudget = totalBudget + expense.value;
  });

  let date = new Date(year, income[0].month - 1, 21); // 2020-06-21
  const highestIncMonth = date.toLocaleString("en-us", { month: "long" });

  date = new Date(year, budget[0].month - 1, 21); // 2020-06-21
  const highestBudMonth = date.toLocaleString("en-us", { month: "long" });

  date = new Date(year, income[income.length - 1].month - 1, 21); // 2020-06-21
  const lowestIncMonth = date.toLocaleString("en-us", { month: "long" });

  date = new Date(year, budget[budget.length - 1].month - 1, 21); // 2020-06-21
  const lowestBudMonth = date.toLocaleString("en-us", { month: "long" });

  const totalBalance = totalIncome - totalBudget - totalexpenses;

  const personalExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "PERSONAL",
  });
  let personalExpensesValue = 0;
  personalExpenses.forEach((expense) => {
    personalExpensesValue = personalExpensesValue + expense.value;
  });
  const personalExpensesPercentage =
    (personalExpensesValue / totalexpenses) * 100;

  const healthExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "HEALTH",
  });
  let healthExpensesValue = 0;
  healthExpenses.forEach((expense) => {
    healthExpensesValue = healthExpensesValue + expense.value;
  });
  const healthExpensesPercentage = (healthExpensesValue / totalexpenses) * 100;

  const entertainmentExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "ENTERTAINMENT",
  });
  let entertainmentExpensesValue = 0;
  entertainmentExpenses.forEach((expense) => {
    entertainmentExpensesValue = entertainmentExpensesValue + expense.value;
  });
  const entertainmentExpensesPercentage =
    (entertainmentExpensesValue / totalexpenses) * 100;

  const houseExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "HOUSE",
  });
  let houseExpensesValue = 0;
  houseExpenses.forEach((expense) => {
    houseExpensesValue = houseExpensesValue + expense.value;
  });
  const houseExpensesPercentage = (houseExpensesValue / totalexpenses) * 100;

  const transportExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "TRANSPORT",
  });
  let transportExpensesValue = 0;
  transportExpenses.forEach((expense) => {
    transportExpensesValue = transportExpensesValue + expense.value;
  });
  const transportExpensesPercentage =
    (transportExpensesValue / totalexpenses) * 100;

  const foodExpenses = await expenseDal.findExpensesByYearAndCategory({
    accountId: Number(accountId),
    year: Number(year),
    category: "FOOD",
  });
  let foodExpensesValue = 0;
  foodExpenses.forEach((expense) => {
    foodExpensesValue = foodExpensesValue + expense.value;
  });
  const foodExpensesPercentage = (foodExpensesValue / totalexpenses) * 100;

  const fonts = {
    Roboto: {
      normal: __dirname + "/public/fonts/Roboto-Regular.ttf",
      bold: __dirname + "/public/fonts/Roboto-Medium.ttf",
      italics: __dirname + "/public/fonts/Roboto-Italic.ttf",
      bolditalics: __dirname + "/public/fonts/Roboto-MediumItalic.ttf",
    },
  };

  const PdfPrinter = require("pdfmake");
  const printer = new PdfPrinter(fonts);
  const fs = require("fs");

  const docDefinition = {
    content: [
      {
        text: `Account: ${existingAccount.name}`,
        style: "header",
      },
      {
        text: `You can find below the financial report for the year ${year}.`,
        style: "subheader",
      },
      {
        style: "tableExample",
        fillColor: "#eeffee",
        table: {
          widths: [120, 120, 120, 120],
          body: [
            ["Total income", "Total budget", "Total expenses", "Total balance"],
            [
              `${totalIncome} $`,
              `${totalBudget} $`,
              `${totalexpenses} $`,
              `${totalBalance} $`,
            ],
          ],
        },
        margin: [0, 20, 0, 20],
      },
      {
        style: "tableExample",
        fillColor: "#eeffee",
        table: {
          widths: [120, 120, 120, 120],
          body: [
            [
              "Highest income",
              "Highest budget",
              "Lowest income",
              "Lowest budget",
            ],
            [
              `${highestIncMonth}: ${income[0].value} $`,
              `${highestBudMonth}: ${budget[0].value} $`,
              `${lowestIncMonth}: ${income[income.length - 1].value} $`,
              `${lowestBudMonth}: ${budget[budget.length - 1].value} $`,
            ],
          ],
        },
        margin: [0, 20, 0, 20],
      },
      {
        text: `Details of your expenses`,
        style: "subheader",
      },
      {
        columns: [
          {
            width: 100,
            text: "House:",
          },
          {
            width: 50,
            text: `${houseExpensesValue} $`,
          },
          {
            width: houseExpensesPercentage * 4,
            fillColor: "#C39BD3",
            table: {
              widths: [houseExpensesPercentage * 4],
              body: [[`${houseExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Food:",
          },
          {
            width: 50,
            text: `${foodExpensesValue} $`,
          },
          {
            width: foodExpensesPercentage * 4,
            fillColor: "#FAD7A0",
            table: {
              widths: [foodExpensesPercentage * 4],
              body: [[`${foodExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Transport:",
          },
          {
            width: 50,
            text: `${transportExpensesValue} $`,
          },
          {
            width: transportExpensesPercentage * 4,
            fillColor: "#AED6F1",
            table: {
              widths: [transportExpensesPercentage * 4],
              body: [[`${transportExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Health:",
          },
          {
            width: 50,
            text: `${healthExpensesValue} $`,
          },
          {
            width: healthExpensesPercentage * 4,
            fillColor: "#ABEBC6",
            table: {
              widths: [healthExpensesPercentage * 4],
              body: [[`${healthExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Entertainment:",
          },
          {
            width: 50,
            text: `${entertainmentExpensesValue} $`,
          },
          {
            width: entertainmentExpensesPercentage * 4,
            fillColor: "#F5B7B1",
            table: {
              widths: [entertainmentExpensesPercentage * 4],
              body: [[`${entertainmentExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        columns: [
          {
            width: 100,
            text: "Personal:",
          },
          {
            width: 50,
            text: `${personalExpensesValue} $`,
          },
          {
            width: personalExpensesPercentage * 4,
            fillColor: "#AEB6BF",
            table: {
              widths: [personalExpensesPercentage * 4],
              body: [[`${personalExpensesPercentage.toFixed()} %`]],
            },
            margin: [0, -2, 0, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 15],
      },
      tableExample: {
        margin: [0, 25, 25, 25],
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };

  const options = {
    // ...
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream("document.pdf"));
  pdfDoc.end();
};
