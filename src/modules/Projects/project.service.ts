import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

import { ProjectRepository } from "./repository/project.repository";


import { AppError } from "../../common/errors/AppError";
import { WorkspaceMemberRepository } from "../Workspace_Members/repository/workspace-member-repository";

export class ProjectService {

    private projectRepository =
        new ProjectRepository();

    private workspaceMemberRepository =
        new WorkspaceMemberRepository();


    async createProject(
        userId: number,
        workspaceId: number,
        data: CreateProjectDto
    ) {

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

        return await this.projectRepository.create(

            member.workspace,

            data

        );

    }


    async getProjects(
        userId: number,
        workspaceId: number
    ) {

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

        return await this.projectRepository
            .findByWorkspaceId(
                workspaceId
            );

    }


    async getProjectById(
        userId: number,
        projectId: number
    ) {
        const project =
            await this.projectRepository
                .findById(
                    projectId
                );

        if (!project) {

            throw new AppError(
                "Project not found",
                404
            );

        }
        const workspaceId = project.workspace.id;

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


        return project;

    }


    async updateProject(
        userId: number, projectId: number, data: UpdateProjectDto) {

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

        if (data.name !== undefined) {

            project.name =
                data.name;

        }

        if (data.description !== undefined) {

            project.description =
                data.description;

        }

        return await this.projectRepository.update(
            project
        );

    }


    async deleteProject(
        userId: number,
        projectId: number
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

        return await this.projectRepository.delete(
            projectId
        );

    }

}