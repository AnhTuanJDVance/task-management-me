import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Task } from "./Task";
import { User } from "./User";


@Entity()
export class Attachment {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "varchar",
        length: 500
    })
    url: string;


    @ManyToOne(
        () => Task
    )
    task: Task;


    @ManyToOne(
        () => User
    )
    uploadedBy: User;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}