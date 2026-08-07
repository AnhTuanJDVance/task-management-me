import { Router } from "express";

import { UserController } from "./user.controller";

import { authenticate } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
    updateProfileSchema
} from "./user.validation";

const router = Router();

const userController =
    new UserController();

router.get(

    "/profile",

    authenticate,

    userController.getProfile

);

router.put(

    "/profile",

    authenticate,

    validate(
        updateProfileSchema
    ),

    userController.updateProfile

);

export default router;