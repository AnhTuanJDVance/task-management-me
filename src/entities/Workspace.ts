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
import { Project } from "./Project";
import { Label } from "./Label";


@Entity()
export class Workspace {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    type: "varchar",
    length: 255
  })
  name: string;


  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.workspace
  )
  members: WorkspaceMember[];


  @OneToMany(
    () => Project,
    (project) => project.workspace
  )
  projects: Project[];


  @OneToMany(
    () => Label,
    (label) => label.workspace
  )
  labels: Label[];


  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;


  @DeleteDateColumn()
  deletedAt: Date;

}