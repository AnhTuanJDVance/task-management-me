import { AppDataSource } from "../../../database/data-source";

import {
    WorkspaceMember
} from "../../../entities/WorkspaceMember";
import { WorkspaceRole } from "../../../common/enums/workspace-role.enum";

import { User } from "../../../entities/User";

import { Workspace } from "../../../entities/Workspace";

export class WorkspaceMemberRepository {

    private workspaceMemberRepository =
        AppDataSource.getRepository(
            WorkspaceMember
        );



    async findMember(
        workspaceId: number,
        userId: number
    ) {

        return await this.workspaceMemberRepository.findOne({

            where: {

                workspace: {

                    id: workspaceId

                },

                user: {

                    id: userId

                }

            },

            relations: {

                workspace: true,

                user: true

            }

        });

    }


    async createWorkspaceMember(
        user: User,
        workspace: Workspace,
        role: WorkspaceRole = WorkspaceRole.MEMBER
    ) {

        const member =
            this.workspaceMemberRepository.create({

                user,

                workspace,

                role

            });

        return await this.workspaceMemberRepository.save(
            member
        );

    }

    async findWorkspaceMemberById(
        id: number
    ) {

        return await this.workspaceMemberRepository.findOne({

            where: {
                id
            },

            relations: {

                user: true,

                workspace: true

            }

        });

    }





    async findByUserAndWorkspace(
        userId: number,
        workspaceId: number
    ) {

        return await this.workspaceMemberRepository.findOne({

            where: {

                user: {

                    id: userId

                },

                workspace: {

                    id: workspaceId

                }

            }

        });

    }

    async update(
        member: WorkspaceMember
    ) {

        return await this.workspaceMemberRepository.save(
            member
        );

    }

    async delete(
        id: number
    ) {

        return await this.workspaceMemberRepository.softDelete(
            id
        );

    }

    async getRole(
        userId: number,
        workspaceId: number
    ) {

        const member =
            await this.findByUserAndWorkspace(
                userId,
                workspaceId
            );

        return member?.role ?? null;

    }

    async findByWorkspaceId(
        workspaceId: number
    ) {

        return await this.workspaceMemberRepository.find({

            where: {

                workspace: {

                    id: workspaceId

                }

            },

            relations: {

                user: true

            }

        });

    }

async findByUserIdAndWorkspaceId(
    userId: number,
    workspaceId: number
) {

    return await this.workspaceMemberRepository.findOne({

        where: {

            user: {
                id: userId
            },

            workspace: {
                id: workspaceId
            }

        },

        relations: {

            user: true,
            workspace: true

        }

    });

}

}