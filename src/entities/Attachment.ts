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
import { Project } from "./Project";


@Entity()
export class Attachment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    fileName: string;

    @Column({
        type: "varchar",
        length: 500
    })
    url: string;

    @Column({
        type: "varchar",
        length: 100
    })
    mimeType: string;

    @Column({
        type: "bigint"
    })
    size: number;

    @ManyToOne(
        () => Project,
        project => project.attachments,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    project: Project;


    @ManyToOne(
        () => Task,
        task => task.attachments,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    task: Task | null;
    
    @ManyToOne(
        () => User,
        user => user.attachments
    )
    uploadedBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}