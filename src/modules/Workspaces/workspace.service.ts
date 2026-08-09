import { CreateWorkspaceDto } from "./dto/create-workspace.dto";

import { WorkspaceRepository } from "./repository/workspace.repository";

import { WorkspaceMemberRepository } from "./repository/workspace-member.repository";

import { UserRepository } from "../Users/repository/user.repository";
import { WorkspaceRole } from "../../common/enums/workspace-role.enum";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { AppError } from "../../common/errors/AppError";

export class WorkspaceService {

    private workspaceRepository =
        new WorkspaceRepository();

    private workspaceMemberRepository =
        new WorkspaceMemberRepository();

    private userRepository =
        new UserRepository();



    async createWorkspace(
        userId: number,
        data: CreateWorkspaceDto
    ) {

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

        const workspace =
            await this.workspaceRepository.create({

                name: data.name

            });

        await this.workspaceMemberRepository.create(

            user,

            workspace,

            WorkspaceRole.OWNER

        );

        return workspace;

    }


    async getMyWorkspaces(
        userId: number
    ) {

        return await this.workspaceRepository.findByUserId(
            userId
        );

    }


    async findWorkspaceById(
        workspaceId: number,
        userId: number
    ) {

        const workspace =
            await this.workspaceRepository.findByIdAndUserId(
                workspaceId,
                userId
            );

        if (!workspace) {

            throw new AppError(
                "Workspace not found",
                404
            );

        }

        return workspace;

    }


    async updateWorkspace(
        workspaceId: number,
        userId: number,
        data: UpdateWorkspaceDto
    ) {

        const workspace =
            await this.workspaceRepository.findById(
                workspaceId
            );

        if (!workspace) {

            throw new AppError(
                "Workspace not found",
                404
            );

        }

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

        if (member.role !== WorkspaceRole.OWNER) {

            throw new AppError(
                "Only workspace owner can update workspace",
                403
            );

        }

        workspace.name =
            data.name;

        return await this.workspaceRepository.update(
            workspace
        );

    }


    async deleteWorkspace(
        workspaceId: number,
        userId: number
    ) {

        const workspace =
            await this.workspaceRepository.findById(
                workspaceId
            );

        if (!workspace) {

            throw new AppError(
                "Workspace not found",
                404
            );

        }

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

        if (member.role !== WorkspaceRole.OWNER) {

            throw new AppError(
                "Only workspace owner can delete workspace",
                403
            );

        }

        return await this.workspaceRepository.delete(
            workspaceId
        );

    }

}