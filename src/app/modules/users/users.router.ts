import { Router } from 'express';
import Passport from 'passport';

import * as controller from './users.controller';

const router = Router();
const BASE_ROUTE = `/users`;


/**
 * Read all users.
 * 
 * @openapi
 * 
 * paths:
 *   /users:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Users
 *       summary: Read all users (Admin only)
 *       description: Reads all users.
 *       responses:
 *         200:
 *           description: Users read successfully.
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
  controller.getUsers,
);

/**
 * Read profile.
 * 
 * @openapi
 * 
 * paths:
 *   /users/profile:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Users
 *       summary: Read user profile
 *       description: Reads user profile.
 *       responses:
 *         200:
 *           description: Profile read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         401:
 *           $ref: "#/components/responses/401"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/profile`).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getUser,
);

/**
 * Update user profile.
 * 
 * @openapi
 * 
 * paths:
 *   /users/profile:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Users
 *       summary: Update user profile
 *       description: Updates user profile.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       responses:
 *         204:
 *           description: User updated successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         422:
 *           description: Unprocessable Entity
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/profile`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.patchUser,
);


export default router;
