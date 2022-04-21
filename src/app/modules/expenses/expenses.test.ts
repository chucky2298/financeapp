import Chai from "chai";
import ChaiHTTP from "chai-http";
import { stub } from "sinon";
import { faker } from "@faker-js/faker";
import { initServer, server } from "../../../index";
import * as dal from "../auth/auth.dal";
import * as expenseDal from "./expenses.dal";
import * as accountsDal from "../accounts/accounts.dal";
import mailService from "../../config/mail";

Chai.use(ChaiHTTP);

describe(`Test "expense" endpoints`, () => {
  const email = faker.internet.email();
  const emailTwo = faker.internet.email();
  let confirmationToken = null;
  const password = "Ran@0m?pass";
  let userToken = null;
  let sendEmailStub = null;
  let accountId = null;
  let expenseId = null;
  const fakeAccountId = 3000;
  const name = "Housing";
  const month = 8;
  const year = 2023;
  const value = 1400;
  const description = "Drinks";
  const category = "FOOD";
	let userTokenTwo = null;

  beforeAll(async () => {
    await initServer();
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    await expenseDal.deleteExpenses({ query: {} });
    sendEmailStub = stub(mailService, "sendEmail").resolves();
  });

  it('Test "POST /auth/register" (Success test case)', async () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email,
      password,
      redirectUrl: faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post("/api/v1/auth/register")
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PUT /auth/confirmation" (Success test case)', async () => {
    const user = await dal.findUser(email.toLowerCase());
    confirmationToken = user.confirmationToken;

    const response = await Chai.request(server).put(
      `/api/v1/auth/confirmation?token=${confirmationToken}`
    );

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "POST /auth/login" (Success test case)', async () => {
    const body = {
      email,
      password,
    };
    const response = await Chai.request(server)
      .post("/api/v1/auth/login")
      .send(body);

    Chai.expect(response.status).to.equal(200);
    userToken = `Bearer ${response.body.token}`;
  });

  it('Test "POST /auth/register" (Success test case)', async () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: emailTwo,
      password,
      redirectUrl: faker.internet.url(),
    };
    const response = await Chai.request(server)
      .post("/api/v1/auth/register")
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PUT /auth/confirmation" (Success test case)', async () => {
    const user = await dal.findUser(emailTwo.toLowerCase());
    confirmationToken = user.confirmationToken;
    const response = await Chai.request(server).put(
      `/api/v1/auth/confirmation?token=${confirmationToken}`
    );

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "POST /auth/login" (Success test case)', async () => {
    const body = {
      email: emailTwo,
      password,
    };
    const response = await Chai.request(server)
      .post("/api/v1/auth/login")
      .send(body);

    Chai.expect(response.status).to.equal(200);
    userTokenTwo = `Bearer ${response.body.token}`;
  });

  it('Test "POST /accounts" (Success test case)', async () => {
    const body = {
      name,
    };
    const response = await Chai.request(server)
      .post("/api/v1/accounts")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
    accountId = response.body.id;
  });

  /**
   * Endpoint: "GET /expenses"
   */

  it('Test "GET /expenses"', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/expenses/`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  /**
   * Endpoint: "GET /account_expenses/id"
   */

  it('Test "GET /account_expenses/id": Success case', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/account_expenses/id?id=${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(201);
  });

  it('Test "GET /account_expenses": Fail case, account not found', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/account_expenses/id?id=${fakeAccountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal("Account does not exist");
  });

  /**
   * Endpoint: "POST /expenses"
   */

  it('Test "POST /expenses" (Success test case)', async () => {
    const body = {
      accountId,
      month,
      year,
      value,
			description,
			category
    };
    const response = await Chai.request(server)
      .post("/api/v1/expenses")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
    expenseId = response.body.id;
  });

  it('Test "POST /expenses" (Fail test case, account not found)', async () => {
    const body = {
      accountId: fakeAccountId,
      month,
      year,
      value,
      description,
      category,
    };
    const response = await Chai.request(server)
      .post("/api/v1/expenses")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "POST /expenses" (Fail test case, you are not member of this account)', async () => {
    const body = {
      accountId,
      month,
      year,
      value,
      description,
      category,
    };
    const response = await Chai.request(server)
      .post("/api/v1/expenses")
      .set("authorization", userTokenTwo)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  /**
   * Endpoint: "PATCH /expenses/id"
   */

  it('Test "PATCH /expenses" (Success test case)', async () => {
    const body = {
      value: 300,
			description: "drink",
			category: "TRANSPORT"
    };
    const response = await Chai.request(server)
      .patch(`/api/v1/expenses/id?id=${expenseId}`)
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PATCH /expenses" (Fail test case, expense not found)', async () => {
    const body = {
      value: 300,
      description: "drink",
      category: "TRANSPORT",
    };
    const response = await Chai.request(server)
      .patch("/api/v1/expenses/id?id=444444")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "PATCH /expenses" (Fail test case, you are not member of this account)', async () => {
    const body = {
      value: 300,
      description: "drink",
      category: "TRANSPORT",
    };
    const response = await Chai.request(server)
      .patch(`/api/v1/expenses/id?id=${expenseId}`)
      .set("authorization", userTokenTwo)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  afterAll(async () => {
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    await expenseDal.deleteExpenses({ query: {} });
    sendEmailStub.restore();
  });
});
