import { Request, Response, NextFunction } from "express";

import { AttachmentService } from "./attachment.service";

export class AttachmentController {

    constructor(

        private attachmentService =
            new AttachmentService()

    ) { }

    upload = async (

        req: Request,

        res: Response,

        next: NextFunction

    ) => {

        try {

            const attachment =
                await this.attachmentService.upload(

                    req.file!,

                    req.body,

                    req.user!.id

                );

            res.status(201).json({

                success: true,

                message: "Upload file successfully",

                data: attachment

            });

        } catch (err) {

            next(err);

        }

    };

    getByProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const projectId =
                Number(req.params.projectId);

            const attachments =
                await this.attachmentService.getByProject(
                    projectId,
                    req.user!.id
                );

            res.status(200).json({
                success: true,
                message: "Get project attachments successfully",
                data: attachments
            });
        } catch (err) {
            next(err);
        }
    };

    getByTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const taskId =
                Number(req.params.taskId);

            const attachments =
                await this.attachmentService.getByTask(
                    taskId,
                    req.user!.id
                );

            res.status(200).json({
                success: true,
                message: "Get task attachments successfully",
                data: attachments
            });
        } catch (err) {
            next(err);
        }
    };

    download = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {

            const attachmentId =
                Number(req.params.id);

            const file =
                await this.attachmentService.download(
                    attachmentId,
                    req.user!.id
                );

            res.download(
                file.filePath,
                file.fileName
            );

        } catch (err) {
            next(err);
        }
    };

}