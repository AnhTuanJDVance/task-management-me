import { Router } from "express";

import { WorkspaceMembersController } from "./workspace-members.controller";

import { authenticate } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";


const router = Router();

const workspaceMembersController =
    new WorkspaceMembersController();

router.post(

    "/workspaces/:workspaceId/members",

    authenticate,

    workspaceMembersController.addWorkspaceMember

);

router.put(

    "/workspaces/:workspaceId/members/:memberId",

    authenticate,

    workspaceMembersController.updateWorkspaceMember

);

router.delete(

    "/workspaces/:workspaceId/members/:memberId",

    authenticate,

    workspaceMembersController.deleteWorkspaceMember

);

export default router;