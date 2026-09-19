import { Router } from "express";

import { TaskController } from "./task.controller";
import { createTaskSchema, updateTaskSchema } from "./task.validation";
import { authenticate } from "../../middlewares/auth.middleware";


import { validate } from "../../middlewares/validate.middleware";

const router = Router();

const taskController =
    new TaskController();

router.post(
    "/projects/:projectId/tasks",
    authenticate,
    validate(
        createTaskSchema
    ),
    taskController.createTask
);

router.get(
    "/projects/:projectId/tasks",
    authenticate,
    taskController.getTasks
);

router.get(
    "/projects/:projectId/tasks/:taskId",
    authenticate,
    taskController.getTaskById
);


router.put(
    "/tasks/:taskId",
    authenticate,
    validate(
        updateTaskSchema
    ),
    taskController.updateTask
);

router.delete(
    "/tasks/:taskId",
    authenticate,
    taskController.deleteTask
);

router.patch(
    "/tasks/:taskId/status",
    authenticate,
    taskController.updateStatusTask
);

router.patch(
    "/tasks/:taskId/priority",
    authenticate,
    taskController.updatePriorityTask
);

router.patch(
    "/tasks/:taskId/assignee",
    authenticate,
    taskController.updateAssigneeTask
);

router.delete(
    "/tasks/:taskId/assignee",
    authenticate,
    taskController.removeAssigneeTask
);


export default router;