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