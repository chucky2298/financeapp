import { Router } from 'express';
import Passport from 'passport';

import * as controller from './accounts.controller';

const router = Router();
const BASE_ROUTE = `/accounts`;


/**
 * Read all accounts.
 * 
 * @openapi
 * 
 * paths:
 *   /accounts:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Accounts
 *       summary: Read all accounts (Admin only)
 *       description: Reads all accounts.
 *       responses:
 *         200:
 *           description: accounts read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/User"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getAccounts,
);

/**
 * Create account.
 * 
 * @openapi
 * 
 * paths:
 *   /accounts:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Accounts
 *       summary: Create account
 *       description: Adds a new account.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - name
 *               properties:
 *                 name:
 *                   type: string
 *       responses:
 *         201:
 *           description: Account created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 airplaneExists:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Unprocessable Entity
 *                     message: Your request was understood but could not be completed due to semantic errors
 *                     details: An account with the same name already exists
 *                   summary: Account exists
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}`).post(
  Passport.authenticate('jwt', { session: false }),
  controller.postAccount,
);


export default router;
