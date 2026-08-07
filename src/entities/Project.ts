import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Workspace } from "./Workspace";
import { Task } from "./Task";


@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        () => Workspace,
        (workspace) => workspace.projects
    )
    workspace: Workspace;


    @OneToMany(
        () => Task,
        (task) => task.project
    )
    tasks: Task[];


    @Column({
        type: "varchar",
        length: 255
    })
    name: string;


    @Column({
        type: "text",
        nullable: true
    })
    description: string;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}