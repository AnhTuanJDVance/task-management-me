import {
    NextFunction,
    Request,
    Response
} from "express";

import { WorkspaceService } from "./workspace.service";


export class WorkspaceController {

    private workspaceService =
        new WorkspaceService();

    createWorkspace = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceService.createWorkspace(
                    req.user.id,
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


    getMyWorkspaces = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceService.getMyWorkspaces(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    getWorkspaceById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceService.findWorkspaceById(
                    Number(req.params.id),
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    updateWorkspace = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.workspaceService.updateWorkspace(
                    Number(req.params.id),
                    req.user.id,
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


    deleteWorkspace = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            await this.workspaceService.deleteWorkspace(
                Number(req.params.id),
                req.user.id
            );

            return res.status(200).json({

                success: true,

                message: "Workspace deleted"

            });

        } catch (error) {

            next(error);

        }

    };

}