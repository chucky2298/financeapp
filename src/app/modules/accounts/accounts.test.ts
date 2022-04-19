import Chai from "chai";
import ChaiHTTP from "chai-http";
import { stub } from "sinon";
import { faker } from "@faker-js/faker";
import { initServer, server } from "../../../index";
import * as dal from "../auth/auth.dal";
import * as accountsDal from "./accounts.dal";
import mailService from "../../config/mail";

Chai.use(ChaiHTTP);

describe(`Test "Auth" endpoints`, () => {
  const email = faker.internet.email();
  let confirmationToken = null;
  const password = "Ran@0m?pass";
  let userToken = null;
  let sendEmailStub = null;
  const name = "Housing";

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

  /**
   * Endpoint: "GET /accounts"
   */

  it('Test "GET /accounts"', async () => {
    console.log("Response body token =======", userToken);
    const response = await Chai.request(server)
      .get(`/api/v1/accounts/`)
      .set("authorization", userToken);

    Chai.expect(response.status).to.equal(200);
  });

  /**
   * Endpoint: "POST /accounts"
   */

  it('Test "POST /accounts" (Success test case)', async () => {
    const body = {
      name,
    };
    const response = await Chai.request(server)
      .post("/api/v1/accounts")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(201);
  });

  it('Test "POST /accounts" (Fail test case: Duplicate names)', async () => {
    const body = {
      name,
    };
    const response = await Chai.request(server)
      .post("/api/v1/accounts")
      .set("authorization", userToken)
      .send(body);

    Chai.expect(response.status).to.equal(422);
  });

  afterAll(async () => {
    await dal.deleteUsers({ query: {} });
    await accountsDal.deleteAccounts({ query: {} });
    sendEmailStub.restore();
  });
});
