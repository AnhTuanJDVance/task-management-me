import path from "path";
import fs from "fs";
import { AppError } from "../../common/errors/AppError";
import { ProjectRepository } from "../Projects/repository/project.repository";
import { TaskRepository } from "../Tasks/repository/task.repository";
import { UserRepository } from "../Users/repository/user.repository";
import { WorkspaceMemberRepository } from "../Workspaces/repository/workspace-member.repository";
import { AttachmentRepository } from "./attachment.repository";
import { UploadAttachmentDto } from "./dto/upload-attachment.dto";

export class AttachmentService {

    constructor(

        private attachmentRepository =
            new AttachmentRepository(),

        private taskRepository =
            new TaskRepository(),

        private userRepository =
            new UserRepository(),

        private workspaceMemberRepository =
            new WorkspaceMemberRepository(),

        private projectRepository =
            new ProjectRepository()

    ) { }

    async upload(
        file: Express.Multer.File,
        data: UploadAttachmentDto,
        userId: number
    ) {
        if (!file) {
            throw new AppError(
                "File is required",
                400
            );
        }

        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                "User not found",
                404
            );
        }

        const project =
            await this.projectRepository.findById(
                data.projectId
            );

        if (!project) {
            throw new AppError(
                "Project not found",
                404
            );
        }


        console.log("PROJECT:", project);
        console.log("PROJECT WORKSPACE:", project?.workspace);
        const workspaceId =
            project.workspace.id;

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        if (!member) {
            throw new AppError(
                "You are not a member of this workspace",
                403
            );
        }

        let task = null;

        if (data.taskId) {
            task =
                await this.taskRepository.findById(
                    data.taskId
                );

            if (!task) {
                throw new AppError(
                    "Task not found",
                    404
                );
            }

            if (
                task.project.id !==
                project.id
            ) {
                throw new AppError(
                    "Task does not belong to this project",
                    400
                );
            }
        }

        const attachment =
            await this.attachmentRepository.create({
                fileName:
                    file.originalname,

                url:
                    `/uploads/${file.filename}`,

                mimeType:
                    file.mimetype,

                size:
                    file.size,

                project,

                task,

                uploadedBy:
                    user
            });

        return attachment;
    }

    async getByProject(
        projectId: number,
        userId: number
    ) {
        const project =
            await this.projectRepository.findById(
                projectId
            );

        if (!project) {
            throw new AppError(
                "Project not found",
                404
            );
        }

        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                "User not found",
                404
            );
        }

        const workspaceId =
            project.workspace.id;

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        if (!member) {
            throw new AppError(
                "You are not a member of this workspace",
                403
            );
        }

        return await this.attachmentRepository
            .findByProjectId(projectId);
    }

    async getByTask(
        taskId: number,
        userId: number
    ) {
        const task =
            await this.taskRepository.findById(
                taskId
            );

        if (!task) {
            throw new AppError(
                "Task not found",
                404
            );
        }

        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {
            throw new AppError(
                "User not found",
                404
            );
        }

        const workspaceId =
            task.project.workspace.id;

        console.log(task)

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        if (!member) {
            throw new AppError(
                "You are not a member of this workspace",
                403
            );
        }

        return await this.attachmentRepository
            .findByTaskId(taskId);
    }

    async download(
        attachmentId: number,
        userId: number,
        fileName?: string
    ) {
        const attachment =
            await this.attachmentRepository.findById(
                attachmentId
            );

        if (!attachment) {
            throw new AppError(
                "Attachment not found",
                404
            );
        }

        const project =
            await this.projectRepository.findById(
                attachment.project.id
            );

        if (!project) {
            throw new AppError(
                "Project not found",
                404
            );
        }

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    project.workspace.id
                );

        if (!member) {
            throw new AppError(
                "You are not a member of this workspace",
                403
            );
        }

        const filePath = path.join(
            process.cwd(),
            attachment.url.replace(
                "/uploads/",
                "uploads/"
            )
        );

        if (!fs.existsSync(filePath)) {
            throw new AppError(
                "File not found",
                404
            );
        }


        const extension =
            path.extname(attachment.fileName);

        const downloadName =
            fileName
                ? `${fileName}${extension.startsWith(".") ? extension : `.${extension}`}`
                : attachment.fileName;
        console.log(extension)

        return {
            filePath,
            fileName: downloadName
        };
    }


}