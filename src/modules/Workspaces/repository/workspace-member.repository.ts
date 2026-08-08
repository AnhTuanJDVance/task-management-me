import { WorkspaceRole } from "../../../common/enums/workspace-role.enum";
import { AppDataSource } from "../../../database/data-source";
import { User } from "../../../entities/User";
import { Workspace } from "../../../entities/Workspace";
import { WorkspaceMember } from "../../../entities/WorkspaceMember";


export class WorkspaceMemberRepository {

  private repository =
    AppDataSource.getRepository(
      WorkspaceMember
    );

  async create(
    user: User,
    workspace: Workspace,
    role: WorkspaceRole
  ) {

    const member =
      this.repository.create({

        user,

        workspace,

        role

      });

    return this.repository.save(
      member
    );

  }

  async findMember(
    workspaceId: number,
    userId: number
  ) {

    return this.repository.findOne({

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

  async findByUserIdAndWorkspaceId(
    userId: number,
    workspaceId: number
  ) {

    return await this.repository.findOne({

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

}