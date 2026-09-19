import { AppDataSource } from "../../database/data-source";
import { Attachment } from "../../entities/Attachment";

export class AttachmentRepository {

    private repository =
        AppDataSource.getRepository(
            Attachment
        );

    async create(
        data: Partial<Attachment>
    ) {

        const attachment =
            this.repository.create(
                data
            );

        return await this.repository.save(
            attachment
        );

    }

    async findById(
        id: number
    ) {

        return await this.repository.findOne({
            where: {
                id
            },
            relations: {
                project: true,
                task: true,
                uploadedBy: true
            }
        });

    }

    async delete(
        id: number
    ) {

        return await this.repository.softDelete(
            id
        );

    }

    async findByProjectId(projectId: number) {
        return await this.repository.find({
            where: {
                project: {
                    id: projectId
                }
            },
            relations: {
                project: true,
                task: true,
                uploadedBy: true
            },
            order: {
                createdAt: "DESC"
            }
        });
    }

    async findByTaskId(taskId: number) {
        return await this.repository.find({
            where: {
                task: {
                    id: taskId
                }
            },
            relations: {
                project: true,
                task: true,
                uploadedBy: true
            },
            order: {
                createdAt: "DESC"
            }
        });
    }



}