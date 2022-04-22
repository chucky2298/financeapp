import { Router } from 'express';
import Passport from 'passport';

import * as controller from './reports.controller';

const router = Router();


/**
 * Generate month report.
 * 
 * @openapi
 * 
 * paths:
 *   /month_report/{month}/{year}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Reports
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Account id
 *           required: true
 *           schema:
 *             type: string
 *         - name: month
 *           in: query
 *           description: Month
 *           required: true
 *           schema:
 *             type: number
 *         - name: year
 *           in: query
 *           description: Year
 *           required: true
 *           schema:
 *             type: number
 *       summary: Generate month report
 *       description: Generates month report for an account.
 *       responses:
 *         200:
 *           description: Report generated successfully.
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

router
  .route("/month_report/:month/:year")
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.generateMonthReport
  );

/**
 * Generate year report.
 * 
 * @openapi
 * 
 * paths:
 *   /year_report/{year}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Reports
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Account id
 *           required: true
 *           schema:
 *             type: string
 *         - name: year
 *           in: query
 *           description: Year
 *           required: true
 *           schema:
 *             type: number
 *       summary: Generate year report
 *       description: Generates year report for an account.
 *       responses:
 *         200:
 *           description: Report generated successfully.
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

router
  .route("/year_report/:year")
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.generateYearReport
  );



export default router;
