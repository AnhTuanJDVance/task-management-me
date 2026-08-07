import { Router } from "express";

import { AuthController } from "./auth.controller";

import { validate } from "../../middlewares/validate.middleware";

import {
    registerSchema,
    loginSchema
} from "./auth.validation";

const router = Router();

const authController =
    new AuthController();

router.post(

    "/register",

    validate(
        registerSchema
    ),

    authController.register

);

router.post(

    "/login",

    validate(
        loginSchema
    ),

    authController.login

);

router.post(

    "/refresh-token",

    authController.refreshToken

);

router.post(

    "/logout",

    authController.logout

);

export default router;