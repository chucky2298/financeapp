import { Router } from 'express';
import Passport from 'passport';

import * as controller from './expenses.controller';

const router = Router();
const BASE_ROUTE = `/expenses`;


/**
 * Read all expenses.
 * 
 * @openapi
 * 
 * paths:
 *   /expenses:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Expenses
 *       summary: Read all expenses
 *       description: Reads all expenses.
 *       responses:
 *         200:
 *           description: expenses read successfully.
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
  controller.getExpenses,
);

/**
 * Read account expenses.
 * 
 * @openapi
 * 
 * paths:
 *   /account_expenses/id:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Expenses
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Account id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Read account expenses
 *       description: Reads account expenses.
 *       responses:
 *         200:
 *           description: expenses read successfully.
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

router.route("/account_expenses/:id").get(
  Passport.authenticate('jwt', { session: false }),
  controller.getExpensesByAccount,
);

/**
 * Create expense.
 * 
 * @openapi
 * 
 * paths:
 *   /expenses:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Expenses
 *       summary: Create expense
 *       description: Adds a new expense.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - accountId
 *                 - month
 *                 - year
 *                 - value
 *                 - description
 *                 - category
 *               properties:
 *                 accountId:
 *                   type: number
 *                 month:
 *                   type: number
 *                 year:
 *                   type: number
 *                 value:
 *                   type: number
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *       responses:
 *         201:
 *           description: expense created successfully.
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
  controller.postExpense,
);

/**
 * Update expense.
 * 
 * @openapi
 * 
 * paths:
 *   /expenses/id:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Expenses
 *       parameters:
 *         - name: id
 *           in: query
 *           description: expense id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Update expense
 *       description: Updates an expense.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 value:
 *                   type: number
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
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

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateExpense,
);

/**
 * Delete expense.
 * 
 * @openapi
 * 
 * paths:
 *   /expenses/id:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Expenses
 *       parameters:
 *         - name: id
 *           in: query
 *           description: expense id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Delete expense
 *       description: Deletes an expense.
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

router.route(`${BASE_ROUTE}/:id`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteExpense,
);

export default router;
