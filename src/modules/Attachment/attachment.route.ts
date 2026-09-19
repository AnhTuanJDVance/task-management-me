import { Router } from "express";

import { AttachmentController } from "./attachment.controller";
import { authenticate } from "../../middlewares/auth.middleware";

import { upload } from "../../common/upload/multer.config";

const router = Router();

const attachmentController =
    new AttachmentController();

router.post(

    "/upload",

    authenticate,

    upload.single("file"),

    attachmentController.upload

);

router.get(
    "/project/:projectId",
    authenticate,
    attachmentController.getByProject
);

router.get(
    "/task/:taskId",
    authenticate,
    attachmentController.getByTask
);

router.get(
    "/:id/download",
    authenticate,
    attachmentController.download
);

export default router;