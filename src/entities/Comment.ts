import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Task,
        (task) => task.comments
    )
    task: Task;

    @ManyToOne(
        () => User
    )
    createdBy: User;

    @Column({
        type: "text"
    })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}