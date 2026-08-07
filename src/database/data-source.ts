import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Attachment } from "../entities/Attachment";
import { Comment } from "../entities/Comment";
import { Label } from "../entities/Label";
import { Notification } from "../entities/Notification";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { TaskAssignee } from "../entities/TaskAssignee";
import { User } from "../entities/User";
import { Workspace } from "../entities/Workspace";
import { WorkspaceMember } from "../entities/WorkspaceMember";
import { RefreshToken } from "../entities/RefreshToken";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  entities: [
    Attachment,
    Comment,
    Label,
    Notification,
    Project,
    Task,
    TaskAssignee,
    User,
    Workspace,
    WorkspaceMember,
    RefreshToken
  ],
  synchronize: true,
  
});
