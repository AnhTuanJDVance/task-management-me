import { Router } from "express";

import { ProjectController } from "./project.controller";

import { authenticate } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";

import {

    createProjectSchema,

    updateProjectSchema

} from "./project.validation";

const router = Router();

const projectController =
    new ProjectController();

router.post(

    "/workspaces/:workspaceId/projects",

    authenticate,

    validate(
        createProjectSchema
    ),

    projectController.createProject

);

router.get(

    "/workspaces/:workspaceId/projects",

    authenticate,

    projectController.getProjects

);

router.get(

    "/workspaces/projects/:projectId",

    authenticate,

    projectController.getProjectById

);

router.put(

    "/workspaces/projects/:projectId",

    authenticate,

    validate(
        updateProjectSchema
    ),

    projectController.updateProject

);

router.delete(

    "/workspaces/projects/:projectId",

    authenticate,

    projectController.deleteProject

);

export default router;