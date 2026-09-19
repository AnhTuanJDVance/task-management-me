import {
    AppDataSource
} from "../../../database/data-source";

import {
    ConversationMember
} from "../entity/conversation-member.entity";

import {
    Conversation
} from "../entity/conversation.entity";

import {
    User
} from "../../../entities/User";


export class ConversationMemberRepository {

    private repository =
        AppDataSource.getRepository(
            ConversationMember
        );


    // 1. Thêm member vào conversation
    async addMember(
        conversation: Conversation,
        user: User
    ) {

        const member =
            this.repository.create({

                conversation,

                user

            });

        return await this.repository.save(
            member
        );

    }


    // 2. Tìm một member
    async findMember(
        conversationId: number,
        userId: number
    ) {

        return await this.repository.findOne({

            where: {

                conversation: {
                    id: conversationId
                },

                user: {
                    id: userId
                }

            },

            relations: {

                user: true

            }

        });

    }


    // 3. Lấy toàn bộ member của conversation
    async findMembers(
        conversationId: number
    ) {

        return await this.repository.find({

            where: {

                conversation: {
                    id: conversationId
                }

            },

            relations: {

                user: true

            },

            order: {

                joinedAt: "ASC"

            }

        });

    }


    // 4. Xóa member khỏi conversation
    // Soft delete
    async removeMember(
        conversationId: number,
        userId: number
    ) {

        const member =
            await this.findMember(
                conversationId,
                userId
            );

        if (!member) {

            return null;

        }

        return await this.repository.softRemove(
            member
        );

    }

}