import { NextFunction, Request, Response } from "express";

import { WorkspaceMembersService } from "./workspace-members.service";

export class WorkspaceMembersController {

    private workspaceMembersService =
        new WorkspaceMembersService();

    addWorkspaceMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceMembersService.addWorkspaceMember(
                    req.user.id,
                    Number(req.params.workspaceId),
                    req.body
                );

            return res.status(201).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };

    updateWorkspaceMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceMembersService.updateWorkspaceMember(
                    req.user.id,
                    Number(req.params.workspaceId),
                    Number(req.params.memberId),
                    req.body
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    deleteWorkspaceMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            await this.workspaceMembersService.deleteWorkspaceMember(
                req.user.id,
                Number(req.params.workspaceId),
                Number(req.params.memberId)
            );

            return res.status(200).json({

                success: true,

                message: "Workspace member deleted"

            });

        } catch (error) {

            next(error);

        }

    };
}