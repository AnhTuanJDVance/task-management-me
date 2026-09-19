import { AppDataSource } from "../../../database/data-source";

import { Project } from "../../../entities/Project";

import { Workspace } from "../../../entities/Workspace";

import { CreateProjectDto } from "../dto/create-project.dto";

export class ProjectRepository {

    private repository =
        AppDataSource.getRepository(
            Project
        );

    async create(
        workspace: Workspace,
        data: CreateProjectDto
    ) {

        const project =
            this.repository.create({

                workspace,

                name: data.name,

                description: data.description

            });

        return await this.repository.save(
            project
        );

    }

    async findById(id: number) {
        return await this.repository
            .createQueryBuilder("project")
            .leftJoinAndSelect(
                "project.workspace",
                "workspace"
            )
            .where("project.id = :id", { id })
            .getOne();
    }

    async findByIdAndWorkspace(
        projectId: number,
        workspaceId: number
    ) {

        return await this.repository.findOne({

            where: {

                id: projectId,

                workspace: {

                    id: workspaceId

                }

            }

        });

    }

    async findByWorkspaceId(
        workspaceId: number
    ) {

        return await this.repository.find({

            where: {

                workspace: {

                    id: workspaceId

                }

            }

        });

    }

    async update(
        project: Project
    ) {

        return await this.repository.save(
            project
        );

    }

    async delete(
        id: number
    ) {

        return await this.repository.softDelete(
            id
        );

    }

}