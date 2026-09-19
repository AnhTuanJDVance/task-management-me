import { ConversationType } from "../../../common/enums/conversation.enum";
import { AppDataSource } from "../../../database/data-source";
import { User } from "../../../entities/User";
import { ConversationMember } from "../entity/conversation-member.entity";
import { Conversation } from "../entity/conversation.entity";

export class ConversationRepository {

    private repository =
        AppDataSource.getRepository(Conversation);


    async findById(
        conversationId: number,
        userId: number
    ) {

        return await this.repository.findOne({

            where: {

                id: conversationId,

                members: {

                    user: {

                        id: userId

                    }

                }

            },

            relations: {

                createdBy: true

            }

        });

    }

    async findDirectConversation(
        userAId: number,
        userBId: number
    ) {

        if (
            userAId === userBId
        ) {

            return null;

        }

        const conversations =
            await this.repository
                .createQueryBuilder("conversation")

                .leftJoinAndSelect(
                    "conversation.members",
                    "member"
                )

                .leftJoinAndSelect(
                    "member.user",
                    "user"
                )

                .where(
                    "conversation.type = :type",
                    {
                        type:
                            ConversationType.DIRECT
                    }
                )

                .getMany();

        // console.log(conversations)
        console.log(conversations.find(conversation => {

            if (
                conversation.members.length !== 2
            ) {

                return false;

            }

            const hasUserA =
                conversation.members.some(
                    member =>
                        member.user.id === userAId
                );

            const hasUserB =
                conversation.members.some(
                    member =>
                        member.user.id === userBId
                );

            return hasUserA && hasUserB;

        }) ?? null)
        return conversations.find(conversation => {

            if (
                conversation.members.length !== 2
            ) {

                return false;

            }

            const hasUserA =
                conversation.members.some(
                    member =>
                        member.user.id === userAId
                );

            const hasUserB =
                conversation.members.some(
                    member =>
                        member.user.id === userBId
                );

            return hasUserA && hasUserB;

        }) ?? null;
    }


    async createDirectConversation(
        createdBy: User
    ) {

        const conversation =
            this.repository.create({

                type:
                    ConversationType.DIRECT,

                createdBy

            });

        return await this.repository.save(
            conversation
        );

    }
}