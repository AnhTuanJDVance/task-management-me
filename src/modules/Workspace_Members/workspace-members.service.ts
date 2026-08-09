import { CreateWorkspaceMemberDto } from "./dto/create-workspace-member.dto";
import { WorkspaceMemberRepository } from "./repository/workspace-member-repository";
import { WorkspaceRepository } from "../Workspaces/repository/workspace.repository";
import { UserRepository } from "../Users/repository/user.repository";
import { WorkspaceRole } from "../../common/enums/workspace-role.enum";
import { UpdateWorkspaceMemberDto } from "./dto/update-workspace-member.dto";
import { AppError } from "../../common/errors/AppError";


export class WorkspaceMembersService {

    private workspaceMemberRepository =
        new WorkspaceMemberRepository();

    private workspaceRepository =
        new WorkspaceRepository();

    private userRepository =
        new UserRepository();


    async addWorkspaceMember(
        userId: number,
        workspaceId: number,
        data: CreateWorkspaceMemberDto
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


        const owner =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        console.log(userId+" "+workspaceId)
        console.log(owner)
        if (
            !owner ||
            owner.role !== WorkspaceRole.OWNER
        ) {

            throw new AppError(
                "Only workspace owner can add members",
                403
            );

        }


        const user =
            await this.userRepository.findById(
                data.userId
            );


        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        const existed =
            await this.workspaceMemberRepository
                .findByUserAndWorkspace(
                    data.userId,
                    workspaceId
                );


        if (existed) {

            throw new AppError(
                "User is already a member of this workspace",
                409
            );

        }


        const role =
            data.role ??
            WorkspaceRole.MEMBER;


        return await this.workspaceMemberRepository
            .createWorkspaceMember(
                user,
                workspace,
                role
            );

    }



    async updateWorkspaceMember(
        userId: number,
        workspaceId: number,
        memberId: number,
        data: UpdateWorkspaceMemberDto
    ) {

        const owner =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );

        if (
            !owner ||
            owner.role !== WorkspaceRole.OWNER
        ) {

            throw new AppError(
                "Only workspace owner can add members",
                403
            );

        }


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
                    memberId,
                    workspaceId
                );


        if (!member) {

            throw new AppError(
                "Member not found in workspace",
                404
            );

        }


        member.role =
            data.role;


        return await this.workspaceMemberRepository
            .update(
                member
            );

    }


    async deleteWorkspaceMember(
        userId: number,
        workspaceId: number,
        memberId: number
    ) {

        const owner =
            await this.workspaceMemberRepository
                .findByUserIdAndWorkspaceId(
                    userId,
                    workspaceId
                );


        if (
            !owner ||
            owner.role !== WorkspaceRole.OWNER
        ) {

            throw new AppError(
                "Only workspace owner can add members",
                403
            );

        }

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
                    memberId,
                    workspaceId
                );


        if (!member) {

            throw new AppError(
                "Member not found in workspace",
                404
            );

        }


        await this.workspaceMemberRepository.delete(
            member.id
        );

    }

}
