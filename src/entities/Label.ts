import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Task } from "./Task";
import { Workspace } from "./Workspace";
import { User } from "./User";


@Entity()
export class Label {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "varchar",
        length: 255
    })
    name: string;


    @Column({
        type: "varchar",
        length: 20
    })
    color: string;


    @ManyToOne(
        () => Workspace,
        (workspace) => workspace.labels,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    workspace: Workspace;


    @ManyToOne(
        () => User,
        {
            nullable: false,
            onDelete: "RESTRICT"
        }
    )
    createdBy: User;


    @ManyToMany(
        () => Task,
        (task) => task.labels
    )
    tasks: Task[];


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}