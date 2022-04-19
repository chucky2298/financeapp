import Chai from "chai";
import ChaiHTTP from "chai-http";
import { stub } from "sinon";
import { faker } from "@faker-js/faker";
import { initServer, server } from "../../../index";
import * as dal from "../auth/auth.dal";
import * as accountsDal from "../accounts/accounts.dal";
import mailService from "../../config/mail";

Chai.use(ChaiHTTP);

describe(`Test "Auth" endpoints`, () => {
  const email = faker.internet.email();
  const emailTwo = faker.internet.email();
  let confirmationToken = null;
  const password = "Ran@0m?pass";
  let userToken = null;
  let userTokenTwo = null;
  let sendEmailStub = null;
  const name = "Housing";
  let accountId = "1";
  let userId = 2;
  let userIdTwo = 2;
  const accountNotFound = "3";

  beforeAll(async () => {
    await initServer();
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
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
    userId = user.id;
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
    userIdTwo = user.id;
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
   * Endpoint: "GET /memberships/all"
   */

  it('Test "GET /memberships"', async () => {
    console.log("Response body token =======", userToken);
    const response = await Chai.request(server)
      .get(`/api/v1/memberships/all`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  /**
   * Endpoint: "POST /memberships"
   */

  it('Test "POST /memberships" (Success test case)', async () => {
    const body = {
      accountId,
      userId: userIdTwo,
    };
    const response = await Chai.request(server)
      .post("/api/v1/memberships")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
  });

  it('Test "POST /memberships" (Fail case: user not found)', async () => {
    const userNF = "6";
    const body = {
      accountId,
      userId: userNF,
    };
    const response = await Chai.request(server)
      .post("/api/v1/memberships")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("User not found");
  });

  it('Test "POST /memberships" (Fail case: account not found)', async () => {
    const accountNF = "6";
    const body = {
      accountId: accountNF,
      userId,
    };
    const response = await Chai.request(server)
      .post("/api/v1/memberships")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("Account not found");
  });

  it('Test "POST /memberships" (Fail case: not manager)', async () => {
    const body = {
      accountId,
      userId,
    };
    const response = await Chai.request(server)
      .post("/api/v1/memberships")
      .set("authorization", userTokenTwo)
      .send(body);

    Chai.expect(response.status).to.equal(403);
    Chai.expect(response.body.details).to.equal("You are not the manager");
  });

  /**
   * Endpoint: "GET /memberships"
   */

  it('Test "GET /memberships"', async () => {
    console.log("Response body token =======", userToken);
    const response = await Chai.request(server)
      .get(`/api/v1/memberships/`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  /**
   * Endpoint: "GET /memberships/id"
   */

  it('Test "GET /memberships/id" Sucess test case', async () => {
    console.log("Response body token =======", userToken);
    const response = await Chai.request(server)
      .get(`/api/v1/memberships/${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  it('Test "GET /memberships/id" Fail test case: account not found', async () => {
    console.log("Response body token =======", userToken);
    const response = await Chai.request(server)
      .get(`/api/v1/memberships/${accountNotFound}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("Account not found");
  });

  /**
   * Endpoint: "PATCH /memberships"
   */

  it('Test "PATCH /memberships" (Fail case: not manager)', async () => {
    const response = await Chai.request(server)
      .patch(`/api/v1/memberships/${userId}/${accountId}`)
      .set("authorization", userTokenTwo);

    Chai.expect(response.status).to.equal(403);
    Chai.expect(response.body.details).to.equal("You are not the manager");
  });

  it('Test "PATCH /memberships" (Success test case)', async () => {
    const response = await Chai.request(server)
      .patch(`/api/v1/memberships/${userIdTwo}/${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "PATCH /memberships" (Fail case: user not found)', async () => {
    const userNF = "6";
    const response = await Chai.request(server)
      .patch(`/api/v1/memberships/${userNF}/${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("User not found");
  });

  it('Test "PATCH /memberships" (Fail case: account not found)', async () => {
    const accountNF = "6";
    const response = await Chai.request(server)
      .patch(`/api/v1/memberships/${userId}/${accountNF}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("Account not found");
  });

  /**
   * Endpoint: "Delete /memberships"
   */

  it('Test "DELETE /memberships" (Success test case)', async () => {
    const response = await Chai.request(server)
      .delete(`/api/v1/memberships/${userIdTwo}/${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(204);
  });

  it('Test "DELETE /memberships" (Fail case: user not found)', async () => {
    const userNF = "6";
    const response = await Chai.request(server)
      .delete(`/api/v1/memberships/${userNF}/${accountId}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("User not found");
  });

  it('Test "DELETE /memberships" (Fail case: account not found)', async () => {
    const accountNF = "6";
    const response = await Chai.request(server)
      .delete(`/api/v1/memberships/${userId}/${accountNF}`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(422);
    Chai.expect(response.body.details).to.equal("Account not found");
  });

  afterAll(async () => {
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    sendEmailStub.restore();
  });
});
