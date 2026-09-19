import { AppDataSource } from "../../../database/data-source";
import { User } from "../../../entities/User";
import { Conversation } from "../entity/conversation.entity";
import { Message } from "../entity/message";


export class MessageRepository {

    private repository =
        AppDataSource.getRepository(Message);

    async createMessage(
        conversation: Conversation,
        sender: User,
        content: string
    ) {

        const message =
            this.repository.create({

                conversation,

                sender,

                content

            });

        return await this.repository.save(
            message
        );

    }

    async findGroupMessages(
        conversationId: number,
        limit: number = 50,
        offset: number = 0
    ) {

        const conversation = await this.repository.find({

            where: {

                conversation: {

                    id: conversationId

                }

            },

            relations: {

                sender: true,

                replyTo: true

            },

            order: {

                createdAt: "ASC"

            },

            take: limit,

            skip: offset

        });
        console.log(conversation)
        console.log("pass3")

        return await this.repository.find({

            where: {

                conversation: {

                    id: conversationId

                }

            },

            relations: {

                sender: true,

                replyTo: true

            },

            order: {

                createdAt: "ASC"

            },

            take: limit,

            skip: offset

        });

    }

}