import {
    NextFunction,
    Request,
    Response
} from "express";

import { ProjectService } from "./project.service";

export class ProjectController {

    private projectService =
        new ProjectService();


    createProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.projectService.createProject(

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


    getProjects = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.projectService.getProjects(

                    req.user.id,

                    Number(req.params.workspaceId)

                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    getProjectById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.projectService.getProjectById(

                    req.user.id,

                    Number(req.params.projectId)

                );

            return res.status(200).json({

                success: true,

                data: result

            });

        } catch (error) {

            next(error);

        }

    };


    updateProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const result =
                await this.projectService.updateProject(

                    req.user.id,

                    Number(req.params.projectId),

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


    deleteProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            await this.projectService.deleteProject(

                req.user.id,

                Number(req.params.projectId)

            );

            return res.status(200).json({

                success: true,

                message: "Project deleted successfully"

            });

        } catch (error) {

            next(error);

        }

    };

}
