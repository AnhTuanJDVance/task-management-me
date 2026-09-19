import { Request, Response } from "express";

import { TaskService } from "./task.service";

export class TaskController {

    private taskService =
        new TaskService();

    async createTask(
        req: Request,
        res: Response
    ) {

        try {

            const createdById =
                req.user!.id;

            const projectId =
                Number(req.params.projectId);

            const task =
                await this.taskService.createTask(

                    createdById,

                    projectId,

                    req.body

                );

            return res.status(201).json({

                success: true,

                message: "Task created successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async getTasks(
        req: Request,
        res: Response
    ) {

        try {

            const projectId =
                Number(req.params.projectId);

            const tasks =
                await this.taskService.getTasks(
                    req.user!.id,
                    projectId
                );

            return res.status(200).json({

                success: true,

                data: tasks

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async getTaskById(
        req: Request,
        res: Response
    ) {

        try {

            const projectId =
                Number(req.params.projectId);

            const taskId =
                Number(req.params.taskId);

            const task =
                await this.taskService.getTaskById(
                    req.user!.id,

                    projectId,

                    taskId

                );

            return res.status(200).json({

                success: true,

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }
    
    async updateTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            const task =
                await this.taskService.updateTask(
                    req.user!.id,

                    taskId,

                    req.body

                );

            return res.status(200).json({

                success: true,

                message: "Task updated successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async deleteTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            await this.taskService.deleteTask(
                req.user!.id,
                taskId
            );

            return res.status(200).json({

                success: true,

                message: "Task deleted successfully"

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async updateStatusTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            const { status } =
                req.body;

            const task =
                await this.taskService.updateStatusTask(
                    req.user!.id,

                    taskId,

                    status

                );

            return res.status(200).json({

                success: true,

                message: "Task status updated successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async updatePriorityTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            const { priority } =
                req.body;

            const task =
                await this.taskService.updatePriorityTask(
                    req.user!.id,

                    taskId,

                    priority

                );

            return res.status(200).json({

                success: true,

                message: "Task priority updated successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async updateAssigneeTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            const { userId } =
                req.body;

            const task =
                await this.taskService.updateAssigneeTask(
                    req.user!.id,

                    taskId,

                    userId

                );

            return res.status(200).json({

                success: true,

                message: "Task assignee updated successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    async removeAssigneeTask(
        req: Request,
        res: Response
    ) {

        try {

            const taskId =
                Number(req.params.taskId);

            const task =
                await this.taskService.removeAssigneeTask(
                    req.user!.id,
                    taskId
                );

            return res.status(200).json({

                success: true,

                message: "Task assignee removed successfully",

                data: task

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

}