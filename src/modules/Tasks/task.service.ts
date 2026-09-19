import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ProjectRepository } from "../Projects/repository/project.repository";
import { TaskRepository } from "./repository/task.repository";
import { UserRepository } from "../Users/repository/user.repository";
import { User } from "../../entities/User";
import { TaskResponseDto } from "./response/task-response.dto";
import { TaskDetailResponseDto } from "./response/task-detail-response.dto";
import { TaskStatus } from "../../common/enums/task-status.enum";
import { TaskPriority } from "../../common/enums/task-priority.enum";
import { AppError } from "../../common/errors/AppError";
import { WorkspaceMemberRepository } from "../Workspace_Members/repository/workspace-member-repository";


export class TaskService {

    private projectRepository =
        new ProjectRepository();

    private taskRepository =
        new TaskRepository();

    private userRepository =
        new UserRepository();

    private workspaceMemberRepository =
        new WorkspaceMemberRepository();

    async createTask(
        createdById: number,
        projectId: number,
        data: CreateTaskDto
    ) {

        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {

            throw new AppError(
                "Project not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(

                    createdById,

                    project.workspace.id

                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        const createdBy =
            await this.userRepository.findById(
                createdById
            );

        if (!createdBy) {

            throw new AppError(
                "User not found",
                404
            );

        }


        let assignee: User | undefined;


        if (data.assigneeId) {

            const user =
                await this.userRepository.findById(
                    data.assigneeId
                );

            if (!user) {

                throw new AppError(
                    "Assignee not found",
                    404
                );

            }


            const assigneeMember =
                await this.workspaceMemberRepository
                    .findByUserIdAndWorkspaceId(

                        data.assigneeId,

                        project.workspace.id

                    );

            if (!assigneeMember) {

                throw new AppError(
                    "Assignee is not a member of this workspace",
                    403
                );

            }


            assignee = user;

        }


        return await this.taskRepository.create(

            project,

            createdBy,

            assignee,

            data

        );

    }


    async getTasks(
        userId: number,
        projectId: number
    ): Promise<TaskResponseDto[]> {

        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {

            throw new AppError(
                "Project not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(

                    userId,

                    project.workspace.id

                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        const tasks =
            await this.taskRepository.findByProjectId(
                projectId
            );


        return tasks.map(task => ({

            id: task.id,

            title: task.title,

            description: task.description,

            status: task.status,

            priority: task.priority,

            dueDate: task.dueDate,

            startDate: task.startDate,

            estimatedHours: task.estimatedHours,

            position: task.position,

            project: {

                id: task.project.id,

                name: task.project.name

            },

            assignee:
                task.assignee
                    ? {

                        id: task.assignee.id,

                        fullName:
                            task.assignee.fullName

                    }
                    : null,

            createdBy: {

                id: task.createdBy.id,

                fullName:
                    task.createdBy.fullName

            },

            createdAt: task.createdAt,

            updatedAt: task.updatedAt

        }));

    }


    async getTaskById(
        userId: number,
        projectId: number,
        taskId: number
    ): Promise<TaskDetailResponseDto> {

        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {

            throw new AppError(
                "Project not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(

                    userId,

                    project.workspace.id

                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        const task =
            await this.taskRepository.findByIdAndProject(

                taskId,

                projectId

            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        return {

            id: task.id,

            title: task.title,

            description: task.description,

            status: task.status,

            priority: task.priority,

            dueDate: task.dueDate,

            startDate: task.startDate,

            estimatedHours: task.estimatedHours,

            position: task.position,

            project: {

                id: task.project.id,

                name: task.project.name

            },

            assignee:
                task.assignee
                    ? {

                        id: task.assignee.id,

                        fullName:
                            task.assignee.fullName,

                        email:
                            task.assignee.email

                    }
                    : null,

            createdBy: {

                id: task.createdBy.id,

                fullName:
                    task.createdBy.fullName

            },

            createdAt: task.createdAt,

            updatedAt: task.updatedAt

        };

    }


    async updateTask(
        userId: number,
        taskId: number,
        data: UpdateTaskDto
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(

                    userId,

                    task.project.workspace.id

                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        if (data.assigneeId !== undefined) {

            const assignee =
                await this.userRepository.findById(
                    data.assigneeId
                );

            if (!assignee) {

                throw new AppError(
                    "Assignee not found",
                    404
                );

            }


            const assigneeMember =
                await this.workspaceMemberRepository
                    .findByUserIdAndWorkspaceId(

                        data.assigneeId,

                        task.project.workspace.id

                    );

            if (!assigneeMember) {

                throw new AppError(
                    "Assignee is not a member of this workspace",
                    403
                );

            }


            task.assignee = assignee;

        }


        if (data.title !== undefined) {

            task.title =
                data.title;

        }


        if (data.description !== undefined) {

            task.description =
                data.description;

        }


        if (data.status !== undefined) {

            task.status =
                data.status;

        }


        if (data.priority !== undefined) {

            task.priority =
                data.priority;

        }


        if (data.dueDate !== undefined) {

            task.dueDate =
                data.dueDate;

        }


        if (data.startDate !== undefined) {

            task.startDate =
                data.startDate;

        }


        if (data.estimatedHours !== undefined) {

            task.estimatedHours =
                data.estimatedHours;

        }


        if (data.position !== undefined) {

            task.position =
                data.position;

        }


        return await this.taskRepository.update(
            task
        );

    }


    async deleteTask(
        userId: number,
        taskId: number
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(

                    userId,

                    task.project.workspace.id

                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        return await this.taskRepository.delete(
            taskId
        );

    }

    async updateStatusTask(
        userId: number,
        taskId: number,
        status: TaskStatus
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    task.project.workspace.id
                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        return await this.taskRepository.updateStatus(
            task,
            status
        );

    }

    async updatePriorityTask(
        userId: number,
        taskId: number,
        priority: TaskPriority
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    task.project.workspace.id
                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        return await this.taskRepository.updatePriority(
            task,
            priority
        );

    }

    async updateAssigneeTask(
        userId: number,
        taskId: number,
        assigneeId: number
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    task.project.workspace.id
                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }

        const user =
            await this.userRepository.findById(
                assigneeId
            );

        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const assigneeMember =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    assigneeId,
                    task.project.workspace.id
                );

        if (!assigneeMember) {

            throw new AppError(
                "Assignee is not a member of this workspace",
                403
            );

        }


        return await this.taskRepository.updateAssignee(
            task,
            user
        );

    }

    async removeAssigneeTask(
        userId: number,
        taskId: number
    ) {

        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                "Task not found",
                404
            );

        }


        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    task.project.workspace.id
                );

        if (!member) {

            throw new AppError(
                "You are not a member of this workspace",
                403
            );

        }


        return await this.taskRepository.removeAssignee(
            task
        );

    }

}