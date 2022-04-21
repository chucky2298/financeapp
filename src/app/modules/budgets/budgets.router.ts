import { Router } from 'express';
import Passport from 'passport';

import * as controller from './budgets.controller';

const router = Router();
const BASE_ROUTE = `/budgets`;


/**
 * Read all budgets.
 * 
 * @openapi
 * 
 * paths:
 *   /budgets:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Budgets
 *       summary: Read all budgets
 *       description: Reads all budgets.
 *       responses:
 *         200:
 *           description: budgets read successfully.
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
  controller.getBudgets,
);

/**
 * Read account budgets.
 * 
 * @openapi
 * 
 * paths:
 *   /account_budgets/id:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Budgets
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Account id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Read account budgets
 *       description: Reads account budgets.
 *       responses:
 *         200:
 *           description: budgets read successfully.
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

router.route("/account_budgets/:id").get(
  Passport.authenticate('jwt', { session: false }),
  controller.getBudgetsByAccount,
);

/**
 * Create budget.
 * 
 * @openapi
 * 
 * paths:
 *   /budgets:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Budgets
 *       summary: Create budget
 *       description: Adds a new budget.
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
 *           description: Budget created successfully.
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
  controller.postBudget,
);

/**
 * Update budget.
 * 
 * @openapi
 * 
 * paths:
 *   /budgets/id:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Budgets
 *       parameters:
 *         - name: id
 *           in: query
 *           description: budget id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Update budget
 *       description: Updates an budget.
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

router.route(`${BASE_ROUTE}/:id`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.updateBudget,
);

/**
 * Delete budget.
 * 
 * @openapi
 * 
 * paths:
 *   /budgets/id:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Budgets
 *       parameters:
 *         - name: id
 *           in: query
 *           description: budget id
 *           required: true
 *           schema:
 *             type: string
 *       summary: Delete budget
 *       description: Deletes an budget.
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
  controller.deleteBudget,
);

export default router;
