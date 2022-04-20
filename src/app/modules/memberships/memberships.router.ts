import { Router } from 'express';
import Passport from 'passport';

import * as controller from './memberships.controller';

const router = Router();
const BASE_ROUTE = `/memberships`;


/**
 * Read all memberships.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships/all:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Read all memberships (Admin only)
 *       description: Read all memberships.
 *       responses:
 *         200:
 *           description: memberships read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/all`)
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.getMemberships
  );


/**
 * Invite member.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Invite member
 *       description: Invites a member to an account.
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               required:
 *                 - accountId
 *                 - userId
 *               properties:
 *                 accountId:
 *                   type: number
 *                 userId:
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

router
  .route(`${BASE_ROUTE}`)
  .post(
    Passport.authenticate("jwt", { session: false }),
    controller.postMembership
  );

	/**
 * Accept invitation.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships/accept_invitation/confirmation:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Accept invitation
 *       description: Sets accepted to boolean to true
 *       parameters:
 *         - name: token
 *           in: query
 *           description: User confirmation token
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Invitation accepted successfully.
 *         400:
 *           $ref: "#/components/responses/400"
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Error"
 *               examples:
 *                 userNotFoundOrConfirmed:
 *                   value:
 *                     code: ckgjkxvgl000431pp4xlpew2g
 *                     name: Not Found
 *                     message: The requested item was not found
 *                     details: The requested user does not exist, or the account is already confirmed
 *                   summary: User not found or account confirmed
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/accept_invitation/confirmation`)
  .patch(
    Passport.authenticate("jwt", { session: false }),
    controller.acceptInvitation
  );

/**
 * Read my memberships.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Read my memberships
 *       description: Read my memberships.
 *       responses:
 *         200:
 *           description: memberships read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(BASE_ROUTE).get(
  Passport.authenticate('jwt', { session: false }),
  controller.getMyMemberships,
);

/**
 * Read account memberships.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships/{id}:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Read account memberships
 *       description: Read account memberships.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Account Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: memberships read successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *         400:
 *           $ref: "#/components/responses/400"
 *         401:
 *           $ref: "#/components/responses/401"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router
  .route(`${BASE_ROUTE}/:id`)
  .get(
    Passport.authenticate("jwt", { session: false }),
    controller.getAccountMemberships
  );

/**
 * Delete membership.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships/{userId}/{accountId}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Delete membership
 *       description: Deletes an existing membership.
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User Id
 *           required: true
 *           schema:
 *             type: string
 *         - name: accountId
 *           in: path
 *           description: Account Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Membership deleted successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:userId/:accountId`).delete(
  Passport.authenticate('jwt', { session: false }),
  controller.deleteMembership,
);

/**
 * Assign manager.
 * 
 * @openapi
 * 
 * paths:
 *   /memberships/{userId}/{accountId}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       tags:
 *         - Memberships
 *       summary: Assign manager
 *       description: Updates a membership with assigning manager.
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: User Id
 *           required: true
 *           schema:
 *             type: string
 *         - name: accountId
 *           in: path
 *           description: Account Id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         204:
 *           description: Membership updated successfully.
 *         401:
 *           $ref: "#/components/responses/401"
 *         403:
 *           $ref: "#/components/responses/403"
 *         404:
 *           $ref: "#/components/responses/404"
 *         500:
 *           $ref: "#/components/responses/500"
 */

router.route(`${BASE_ROUTE}/:userId/:accountId`).patch(
  Passport.authenticate('jwt', { session: false }),
  controller.assignManager,
);

export default router;
