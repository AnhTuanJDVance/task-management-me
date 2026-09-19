import { TaskStatus } from "../../../common/enums/task-status.enum";
import { TaskPriority } from "../../../common/enums/task-priority.enum";

export interface TaskDetailResponseDto {

    id: number;

    title: string;

    description: string | null;

    status: TaskStatus;

    priority: TaskPriority;

    dueDate: Date | null;

    startDate: Date | null;

    estimatedHours: number | null;

    position: number;

    project: {

        id: number;

        name: string;

    };

    assignee: {

        id: number;

        fullName: string;

        email: string;

    } | null;

    createdBy: {

        id: number;

        fullName: string;

    };

    createdAt: Date;

    updatedAt: Date;

}