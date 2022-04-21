import { Router } from 'express';
import Passport from 'passport';

import * as controller from './incomes.controller';

const router = Router();
const BASE_ROUTE = `/incomes`;


/**
 * Read all incomes.
 * 
 * @openapi
 * 
 * paths:
 *   /incomes:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Incomes
 *       summary: Read all incomes
 *       description: Reads all incomes.
 *       responses:
 *         200:
 *           description: incomes read successfully.
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
  controller.getIncomes,
);

/**
 * Read account incomes.
 * 
 * @openapi
 * 
 * paths:
 *   /account_incomes/id:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Incomes
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Account id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Read account incomes
 *       description: Reads account incomes.
 *       responses:
 *         200:
 *           description: incomes read successfully.
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

router.route("/account_incomes/id").get(
  Passport.authenticate('jwt', { session: false }),
  controller.getIncomesByAccount,
);

/**
 * Create income.
 * 
 * @openapi
 * 
 * paths:
 *   /incomes:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Incomes
 *       summary: Create income
 *       description: Adds a new income.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - accountId
 *                 - month
 *                 - year
 *                 - value
 *               properties:
 *                 accountId:
 *                   type: number
 *                 month:
 *                   type: number
 *                 year:
 *                   type: number
 *                 value:
 *                   type: number
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
  controller.postIncome,
);

/**
 * Update income.
 * 
 * @openapi
 * 
 * paths:
 *   /incomes/id:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Incomes
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Income id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Update income
 *       description: Updates an income.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 value:
 *                   type: number
 *       responses:
 *         204:
 *           description: Account updated successfully.
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
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateIncome,
);

/**
 * Delete income.
 * 
 * @openapi
 * 
 * paths:
 *   /incomes/id:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Incomes
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Income id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Delete income
 *       description: Deletes an income.
 *       responses:
 *         204:
 *           description: Account deleted successfully.
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
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteIncome,
);

export default router;
