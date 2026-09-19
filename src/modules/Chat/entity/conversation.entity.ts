import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { ConversationType } from "../../../common/enums/conversation.enum";
import { Project } from "../../../entities/Project";
import { User } from "../../../entities/User";
import { Message } from "./message";
import { ConversationMember } from "./conversation-member.entity";


@Entity("conversations")
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "enum",
        enum: ConversationType
    })
    type: ConversationType;


    @Column({
        type: "varchar",
        nullable: true
    })
    name?: string;


    @Column({
        type: "varchar",
        nullable: true
    })
    avatar?: string;


    @ManyToOne(
        () => Project,
        project => project.conversations,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "projectId"
    })
    project?: Project;


    @ManyToOne(
        () => User
    )
    @JoinColumn({
        name: "createdById"
    })
    createdBy: User;


    @OneToMany(
        () => ConversationMember,
        member => member.conversation
    )
    members: ConversationMember[];


    @OneToMany(
        () => Message,
        message => message.conversation
    )
    messages: Message[];


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt?: Date;

}