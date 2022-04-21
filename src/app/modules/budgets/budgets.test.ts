import Chai from "chai";
import ChaiHTTP from "chai-http";
import { stub } from "sinon";
import { faker } from "@faker-js/faker";
import { initServer, server } from "../../../index";
import * as dal from "../auth/auth.dal";
import * as budgetDal from "./budgets.dal";
import * as accountsDal from "../accounts/accounts.dal";
import mailService from "../../config/mail";

Chai.use(ChaiHTTP);

describe(`Test "budget" endpoints`, () => {
  const email = faker.internet.email();
  const emailTwo = faker.internet.email();
  let confirmationToken = null;
  const password = "Ran@0m?pass";
  let userToken = null;
  let sendEmailStub = null;
  let accountId = null;
  let budgetId = null;
  const fakeAccountId = 3000;
  const name = "Housing";
  const month = 8;
  const year = 2023;
  const value = 1400;
	let userTokenTwo = null;

  beforeAll(async () => {
    await initServer();
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    await budgetDal.deleteBudgets({ query: {} });
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
   * Endpoint: "GET /budgets"
   */

  it('Test "GET /budgets"', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/budgets/`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  /**
   * Endpoint: "GET /account_budgets/id"
   */

  it('Test "GET /account_budgets/id": Success case', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/account_budgets/id?id=${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(201);
  });

  it('Test "GET /account_budgets": Fail case, account not found', async () => {
    const response = await Chai.request(server)
      .get(`/api/v1/account_budgets/id?id=${fakeAccountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(404);
    Chai.expect(response.body.details).to.equal("Account does not exist");
  });

  /**
   * Endpoint: "POST /budgets"
   */

  it('Test "POST /budgets" (Success test case)', async () => {
    const body = {
      accountId,
      month,
      year,
      value,
    };
    const response = await Chai.request(server)
      .post("/api/v1/budgets")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
    budgetId = response.body.id;
  });

  it('Test "POST /budgets" (Fail test case, account not found)', async () => {
    const body = {
      accountId: fakeAccountId,
      month,
      year,
      value,
    };
    const response = await Chai.request(server)
      .post("/api/v1/budgets")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "POST /budgets" (Fail test case, account already has budget for this month)', async () => {
    const body = {
      accountId,
      month,
      year,
      value,
    };
    const response = await Chai.request(server)
      .post("/api/v1/budgets")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(422);
  });

  it('Test "POST /budgets" (Fail test case, you are not member of this account)', async () => {
    const body = {
      accountId,
      month: 10,
      year,
      value,
    };
    const response = await Chai.request(server)
      .post("/api/v1/budgets")
      .set("authorization", userTokenTwo)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  /**
   * Endpoint: "PATCH /budgets/id"
   */

  it('Test "PATCH /budgets" (Success test case)', async () => {
    const body = {
      value: 300,
    };
    const response = await Chai.request(server)
      .patch(`/api/v1/budgets/id?id=${budgetId}`)
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PATCH /budgets" (Fail test case, budget not found)', async () => {
    const body = {
      value: 200,
    };
    const response = await Chai.request(server)
      .patch("/api/v1/budgets/id?id=444444")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(404);
  });

  it('Test "PATCH /budgets" (Fail test case, you are not member of this account)', async () => {
    const body = {
      value: 300,
    };
    const response = await Chai.request(server)
      .patch(`/api/v1/budgets/id?id=${budgetId}`)
      .set("authorization", userTokenTwo)
      .send(body);

    Chai.expect(response.status).to.equal(403);
  });

  afterAll(async () => {
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    await budgetDal.deleteBudgets({ query: {} });
    sendEmailStub.restore();
  });
});
