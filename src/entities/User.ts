import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from "typeorm";

import { WorkspaceMember } from "./WorkspaceMember";
import { Message } from "../modules/Chat/entity/message";
import { ConversationMember } from "../modules/Chat/entity/conversation-member.entity";
import { Attachment } from "./Attachment";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    type: "varchar",
    length: 255,
    unique: true
  })
  email: string;


  @Column({
    type: "varchar",
    length: 255
  })
  password: string;


  @Column({
    type: "varchar",
    length: 100
  })
  fullName: string;


  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.user
  )
  workspaceMembers: WorkspaceMember[];

  @OneToMany(
    () => Message,
    message => message.sender
  )
  messages: Message[];

  @OneToMany(
    () => ConversationMember,
    member => member.user
  )
  conversationMembers: ConversationMember[];

  @OneToMany(
    () => Attachment,
    attachment => attachment.uploadedBy
  )
  attachments: Attachment[];

  @CreateDateColumn({
    type: "timestamp"
  })
  createdAt: Date;


  @UpdateDateColumn({
    type: "timestamp"
  })
  updatedAt: Date;


  @DeleteDateColumn({
    type: "timestamp",
    nullable: true
  })
  deletedAt: Date | null;

}