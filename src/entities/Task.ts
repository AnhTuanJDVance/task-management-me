import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from "typeorm";

import { Project } from "./Project";
import { User } from "./User";
import { Comment } from "./Comment";
import { Label } from "./Label";

import { TaskStatus } from "../common/enums/task-status.enum";
import { TaskPriority } from "../common/enums/task-priority.enum";


@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        () => Project,
        (project) => project.tasks,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project: Project;


    @Column({
        type: "varchar",
        length: 255
    })
    title: string;


    @Column({
        type: "text",
        nullable: true
    })
    description: string | null;


    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.TODO
    })
    status: TaskStatus;


    @Column({
        type: "enum",
        enum: TaskPriority,
        default: TaskPriority.MEDIUM
    })
    priority: TaskPriority;


    @ManyToOne(
        () => User,
        {
            nullable: true,
            onDelete: "SET NULL"
        }
    )
    assignee: User | null;


    @ManyToOne(
        () => User,
        {
            nullable: false,
            onDelete: "RESTRICT"
        }
    )
    createdBy: User;


    @Column({
        type: "timestamp",
        nullable: true
    })
    dueDate: Date | null;


    @Column({
        type: "timestamp",
        nullable: true
    })
    startDate: Date | null;


    @Column({
        type: "int",
        nullable: true
    })
    estimatedHours: number | null;


    @Column({
        type: "int",
        default: 0
    })
    position: number;


    @OneToMany(
        () => Comment,
        (comment) => comment.task
    )
    comments: Comment[];


    @ManyToMany(
        () => Label,
        (label) => label.tasks
    )
    @JoinTable()
    labels: Label[];


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date | null;

}