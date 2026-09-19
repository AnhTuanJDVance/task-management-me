import { z } from "zod";
import { TaskPriority } from "../../common/enums/task-priority.enum";
import { TaskStatus } from "../../common/enums/task-status.enum";

export const createTaskSchema = z.object({

    title: z.string().min(1),

    description: z.string().optional(),

    status: z.nativeEnum(TaskStatus).optional(),

    priority: z.nativeEnum(TaskPriority).optional(),

    assigneeId: z.number().int().positive().optional(),

    dueDate: z.coerce.date().optional(),

    startDate: z.coerce.date().optional(),

    estimatedHours: z.number().positive().optional(),

    position: z.number().int().optional()

});

export const updateTaskSchema = z.object({

    title: z.string().min(1).optional(),

    description: z.string().optional(),

    status: z.nativeEnum(TaskStatus).optional(),

    priority: z.nativeEnum(TaskPriority).optional(),

    assigneeId: z.number().int().positive().optional(),

    dueDate: z.coerce.date().optional(),

    startDate: z.coerce.date().optional(),

    estimatedHours: z.number().positive().optional(),

    position: z.number().int().optional()

});