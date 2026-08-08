import { Router } from "express";

import { WorkspaceController } from "./workspace.controller";

import { authenticate } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {
    createWorkspaceSchema
} from "./workspace.validation";

const router = Router();

const workspaceController =
    new WorkspaceController();

router.post(

    "/",

    authenticate,

    validate(
        createWorkspaceSchema
    ),

    workspaceController.createWorkspace

);

router.get(

    "/",

    authenticate,

    workspaceController.getMyWorkspaces

);

router.get(

    "/:id",

    authenticate,

    workspaceController.getWorkspaceById

);

router.put(

    "/:id",

    authenticate,

    workspaceController.updateWorkspace

);

router.delete(

    "/:id",

    authenticate,

    workspaceController.deleteWorkspace

);

export default router;