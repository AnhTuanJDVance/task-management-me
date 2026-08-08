import { CreateWorkspaceDto } from "./dto/create-workspace.dto";

import { WorkspaceRepository } from "./repository/workspace.repository";

import { WorkspaceMemberRepository } from "./repository/workspace-member.repository";

import { UserRepository } from "../Users/repository/user.repository";
import { WorkspaceRole } from "../../common/enums/workspace-role.enum";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";

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
            throw new Error(
                "User not found"
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

            throw new Error(
                "Workspace not found"
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

            throw new Error(
                "Workspace not found"
            );

        }

        const member =
            await this.workspaceMemberRepository.findByUserIdAndWorkspaceId(
                userId,
                workspaceId
            );

        if (!member || member.role !== "OWNER") {

            throw new Error(
                "Only workspace owner can update workspace"
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

            throw new Error(
                "Workspace not found"
            );

        }

        const member =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        if (!member || member.role !== "OWNER") {

            throw new Error(
                "Only workspace owner can delete workspace"
            );

        }

        return await this.workspaceRepository.delete(
            workspaceId
        );

    }

}