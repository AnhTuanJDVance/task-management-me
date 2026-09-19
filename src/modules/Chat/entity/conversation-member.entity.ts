import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    DeleteDateColumn,
    Column
} from "typeorm";

import { Conversation } from "./conversation.entity";
import { User } from "../../../entities/User";
import { Message } from "./message";


@Entity("conversation_members")
export class ConversationMember {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        () => Conversation,
        conversation => conversation.members
    )
    @JoinColumn({
        name: "conversationId"
    })
    conversation: Conversation;

    @ManyToOne(
        () => User,
        user => user.conversationMembers,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "userId"
    })
    user: User;


    @ManyToOne(
        () => Message,
        {
            nullable: true,
            onDelete: "SET NULL"
        }
    )
    @JoinColumn({
        name: "lastReadMessageId"
    })
    lastReadMessage?: Message;


    @Column({
        type: "timestamp",
        nullable: true
    })
    leftAt?: Date;


    @CreateDateColumn()
    joinedAt: Date;


    @DeleteDateColumn()
    deletedAt?: Date;

}