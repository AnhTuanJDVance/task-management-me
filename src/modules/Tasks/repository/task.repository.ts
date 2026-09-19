import { AppDataSource } from "../../../database/data-source";

import { Task } from "../../../entities/Task";

import { Project } from "../../../entities/Project";

import { User } from "../../../entities/User";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../../../common/enums/task-status.enum";
import { TaskPriority } from "../../../common/enums/task-priority.enum";


export class TaskRepository {

    private repository =
        AppDataSource.getRepository(
            Task
        );

    async create(
        project: Project,
        createdBy: User,
        assignee: User | undefined,
        data: CreateTaskDto
    ) {

        const task =
            this.repository.create({

                project,

                createdBy,

                assignee,

                title: data.title,

                description: data.description,

                status: data.status,

                priority: data.priority,

                dueDate: data.dueDate,

                startDate: data.startDate,

                estimatedHours: data.estimatedHours,

                position: data.position

            });

        return await this.repository.save(
            task
        );

    }

async findById(id: number) {
    return await this.repository.findOne({
        where: {
            id
        },
        relations: {
            project: {
                workspace: true
            },
            assignee: true,
            createdBy: true
        }
    });
}

    async findByIdAndProject(
        taskId: number,
        projectId: number
    ) {

        return await this.repository.findOne({

            where: {

                id: taskId,

                project: {

                    id: projectId

                }

            },

            relations: {

                project: true,

                assignee: true,

                createdBy: true

            }

        });

    }

    async findByProjectId(
        projectId: number
    ): Promise<Task[]> {

        return await this.repository.find({

            where: {
                project: {
                    id: projectId
                }
            },

            relations: {
                assignee: true,
                createdBy: true
            },

            order: {
                position: "ASC"
            }

        });

    }

    async update(
        task: Task
    ) {

        return await this.repository.save(
            task
        );

    }

    async delete(
        id: number
    ) {

        return await this.repository.softDelete(
            id
        );

    }

    async updateStatus(
        task: Task,
        status: TaskStatus
    ) {

        task.status = status;

        return await this.repository.save(task);

    }

    async updatePriority(
        task: Task,
        priority: TaskPriority
    ) {

        task.priority = priority;

        return await this.repository.save(task);

    }

    async updateAssignee(
        task: Task,
        assignee: User
    ) {

        task.assignee = assignee;

        return await this.repository.save(task);

    }

    async removeAssignee(
        task: Task
    ) {

        task.assignee = null;

        return await this.repository.save(task);

    }


}