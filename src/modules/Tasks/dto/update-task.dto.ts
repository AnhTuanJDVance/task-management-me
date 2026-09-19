import { TaskStatus } from "../../../common/enums/task-status.enum";
import { TaskPriority } from "../../../common/enums/task-priority.enum";

export interface UpdateTaskDto {

    title?: string;

    description?: string;

    status?: TaskStatus;

    priority?: TaskPriority;

    assigneeId?: number;

    dueDate?: Date;

    startDate?: Date;

    estimatedHours?: number;

    position?: number;

}