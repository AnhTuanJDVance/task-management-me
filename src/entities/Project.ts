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
import { Conversation } from "../modules/Chat/entity/conversation.entity";
import { Attachment } from "./Attachment";


@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Workspace,
        (workspace) => workspace.projects,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
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

    @OneToMany(
        () => Conversation,
        conversation => conversation.project
    )
    conversations: Conversation[];

    @OneToMany(
        () => Attachment,
        attachment => attachment.project
    )
    attachments: Attachment[];

    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt: Date;

}