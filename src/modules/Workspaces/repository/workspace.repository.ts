import { AppDataSource } from "../../../database/data-source";

import { Workspace } from "../../../entities/Workspace";

export class WorkspaceRepository {

  private repository =
    AppDataSource.getRepository(
      Workspace
    );

  async delete(
    id: number
  ) {

    return await this.repository.softDelete(
      id
    );

  }

  async update(
    workspace: Workspace
  ) {

    return this.repository.save(
      workspace
    );

  }

  async create(
    data: Partial<Workspace>
  ) {

    const workspace =
      this.repository.create(
        data
      );

    return this.repository.save(
      workspace
    );

  }

  async findByUserId(
    userId: number
  ) {

    return this.repository
      .createQueryBuilder("workspace")
      .innerJoin(
        "workspace.members",
        "member"
      )
      .leftJoinAndSelect(
        "workspace.members",
        "members"
      )
      .where(
        "member.userId = :userId",
        {
          userId
        }
      )
      .getMany();

  }

  async findById(
    id: number
  ) {

    return this.repository.findOne({

      where: {
        id
      }

    });

  }

  async findByIdAndUserId(
    workspaceId: number,
    userId: number
  ) {

    return this.repository
      .createQueryBuilder("workspace")

      .innerJoin(
        "workspace.members",
        "member"
      )

      .leftJoinAndSelect(
        "workspace.members",
        "members"
      )

      .where(
        "workspace.id = :workspaceId",
        { workspaceId }
      )

      .andWhere(
        "member.userId = :userId",
        { userId }
      )

      .getOne();

  }

}