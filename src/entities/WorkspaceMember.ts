import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Unique
} from "typeorm";

import { User } from "./User";
import { Workspace } from "./Workspace";
import { WorkspaceRole } from "../common/enums/workspace-role.enum";



@Entity()
@Unique(["user", "workspace"])
export class WorkspaceMember {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.workspaceMembers
  )
  user: User;

  @ManyToOne(
    () => Workspace,
    (workspace) => workspace.members
  )
  workspace: Workspace;

  @Column({
    type: "enum",
    enum: WorkspaceRole,
    default: WorkspaceRole.MEMBER
  })
  role: WorkspaceRole;

  @CreateDateColumn()
  joinedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}