import { Router } from "express";
import { authenticationController } from "../controllers/authenticationController";

const router: Router = Router();

/**
 *  @swagger
 *  /api/authentication/authenticate:
 *  post:
 *      summary: Devuelve un access token y los datos del usuario al validar el refresh token en la carga inicial
 *      tags:
 *          - Autenticación
 *      responses:
 *          401:
 *              description: Unauthorized.
 *          200:
 *              description: Successfully authenticated.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      token:
 *                                          type: string
 *                                      id:
 *                                          type: string
 *                                      name:
 *                                          type: string
 *                                      username:
 *                                          type: string
 *                                      email:
 *                                          type: string
 *                                      role:
 *                                          type: string
 *                                      icon_url:
 *                                          type: string
 *                                      banner_url:
 *                                          type: string
 */

router.post('/authenticate', authenticationController.authenticate);

/**
 *  @swagger
 *  /api/authentication/refresh-token:
 *  post:
 *      summary: Devuelve un nuevo access token al validar el refresh token
 *      tags:
 *          - Autenticación
 *      responses:
 *          401:
 *              description: Unauthorized.
 *          200:
 *              description: Ok.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 */

router.post('/refresh-token', authenticationController.refreshToken);

/**
 *  @swagger
 *  /api/authentication/signin:
 *  post:
 *      summary: Recibe los datos de inicio de sesión. Devuelve datos del usuario, access token y refresh token.
 *      tags:
 *          - Autenticación
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                          platform:
 *                              type: string
 *                          captcha_token:
 *                              type: string
 *      responses:
 *          401:
 *              description: Unauthorized.
 *          200:
 *              description: Successfully signed in.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      token:
 *                                          type: string
 *                                      id:
 *                                          type: string
 *                                      name:
 *                                          type: string
 *                                      username:
 *                                          type: string
 *                                      email:
 *                                          type: string
 *                                      role:
 *                                          type: string
 *                                      icon_url:
 *                                          type: string
 *                                      banner_url:
 *                                          type: string
 */

router.post('/signin', authenticationController.signin);

router.post('/signup', authenticationController.signup);

router.post('/logout', authenticationController.logout);

router.post('/verify', authenticationController.verify);

router.post('/activate', authenticationController.activate);

router.post('/recover-password', authenticationController.recoverPassword);

router.post('/reset-password', authenticationController.resetPassword);

router.post('/recover-username', authenticationController.recoverUsername);

export default router;