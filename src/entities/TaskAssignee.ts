import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Task } from "./Task";
import { User } from "./User";


@Entity()
export class TaskAssignee {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        () => Task
    )
    task: Task;


    @ManyToOne(
        () => User
    )
    user: User;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}