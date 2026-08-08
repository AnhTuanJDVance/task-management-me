import {
    Request,
    Response
} from "express";

import { WorkspaceService } from "./workspace.service";


export class WorkspaceController {

    private workspaceService =
        new WorkspaceService();

    createWorkspace = async (
        req: Request,
        res: Response
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

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };

    getMyWorkspaces = async (
        req: Request,
        res: Response
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

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };

    getWorkspaceById = async (
        req: Request,
        res: Response
    ) => {

        try {

            const workspaceId =
                Number(req.params.id);

            const result =
                await this.workspaceService.findWorkspaceById(
                    workspaceId,
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };



    updateWorkspace = async (
        req: Request,
        res: Response
    ) => {

        try {

            const workspaceId =
                Number(req.params.id);

            const result =
                await this.workspaceService.updateWorkspace(
                    workspaceId,
                    req.user.id,
                    req.body
                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };



    deleteWorkspace = async (
        req: Request,
        res: Response
    ) => {

        try {

            const workspaceId =
                Number(req.params.id);

            await this.workspaceService.deleteWorkspace(
                workspaceId,
                req.user.id
            );

            return res.status(200).json({

                success: true,

                message: "Workspace deleted"

            });

        } catch (error) {

            return res.status(400).json({

                success: false,

                message: (error as Error).message

            });

        }

    };

}