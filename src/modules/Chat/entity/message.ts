import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";

import { Conversation } from "./conversation.entity";
import { User } from "../../../entities/User";
import { MessageType } from "../../../common/enums/message.enum";


@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(
        () => Conversation,
        conversation => conversation.messages,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "conversationId"
    })
    conversation: Conversation;


    @ManyToOne(
        () => User,
        user => user.messages
    )
    @JoinColumn({
        name: "senderId"
    })
    sender: User;


    @ManyToOne(
        () => Message,
        {
            nullable: true,
            onDelete: "SET NULL"
        }
    )
    @JoinColumn({
        name: "replyToId"
    })
    replyTo?: Message;


    @Column("text")
    content: string;


    @Column({
        type: "enum",
        enum: MessageType,
        default: MessageType.TEXT
    })
    type: MessageType;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn()
    deletedAt?: Date;

}