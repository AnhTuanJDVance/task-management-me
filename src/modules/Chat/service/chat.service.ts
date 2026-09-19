import { ConversationType } from "../../../common/enums/conversation.enum";
import { AppError } from "../../../common/errors/AppError";
import { UserRepository } from "../../Users/repository/user.repository";
import { WorkspaceMemberRepository } from "../../Workspace_Members/repository/workspace-member-repository";
import { CreateMessageDto } from "../dto/create-message.dto";
import { MessageRepository } from "../repository/message.repository";
import { ConversationRepository } from "../repository/conversation.repository";
import { verifyAccessToken } from "../../../common/utils/jwt";
import { JoinConversationDto } from "../dto/join-conversation.dto";
import { ConversationMemberRepository } from "../repository/conversation-member.repository";


export class ChatService {

    private messageRepository =
        new MessageRepository();

    private conversationRepository =
        new ConversationRepository();

    private conversationMemberRepository =
        new ConversationMemberRepository();

    private userRepository =
        new UserRepository();


    async sendMessage(

        senderId: number,

        conversationId: number,

        content: string

    ) {

        const sender =
            await this.userRepository.findById(
                senderId
            );

        if (!sender) {

            throw new AppError(
                "Sender not found",
                404
            );

        }

        const conversation =
            await this.conversationRepository.findById(

                conversationId,

                senderId

            );

        if (!conversation) {

            throw new AppError(
                "Conversation not found",
                404
            );

        }

        return await this.messageRepository.createMessage(

            conversation,

            sender,

            content

        );

    }

    async getGroupMessages(

        userId: number,

        conversationId: number,

        limit: number = 50,

        offset: number = 0

    ) {

        const conversation =
            await this.conversationRepository.findById(

                conversationId,

                userId

            );

        if (!conversation) {

            throw new AppError(

                "Conversation not found",

                404

            );

        }

        if (

            conversation.type !==
            ConversationType.GROUP

        ) {

            throw new AppError(

                "This is not a group conversation",

                400

            );

        }

        return await this.messageRepository
            .findGroupMessages(

                conversationId,

                limit,

                offset

            );

    }

    async sendDirectMessage(

        senderId: number,

        receiverId: number,

        content: string

    ) {

        // 1. Không cho tự nhắn chính mình
        if (
            senderId === receiverId
        ) {

            throw new AppError(
                "You cannot send a message to yourself",
                400
            );

        }

        // 2. Tìm sender
        const sender =
            await this.userRepository.findById(
                senderId
            );

        if (!sender) {

            throw new AppError(
                "Sender not found",
                404
            );

        }

        // 3. Tìm receiver
        const receiver =
            await this.userRepository.findById(
                receiverId
            );

        if (!receiver) {

            throw new AppError(
                "Receiver not found",
                404
            );

        }

        // 4. Tìm conversation
        const conversation =
            await this.conversationRepository
                .findDirectConversation(
                    senderId,
                    receiverId
                );

        if (!conversation) {

            throw new AppError(
                "Conversation not found. Please join the conversation first",
                404
            );

        }

        // 5. Tạo message
        const message =
            await this.messageRepository
                .createMessage(
                    conversation,
                    sender,
                    content
                );

        // 6. Trả kết quả
        return {

            conversation,

            message

        };

    }

    async joinConversation(

        userId: number,

        receiverId: number

    ) {
        console.log('log 1')

        const user =
            await this.userRepository.findById(
                userId
            );

        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }

        const receiver =
            await this.userRepository.findById(
                receiverId
            );

        if (!receiver) {

            throw new AppError(
                "Receiver not found",
                404
            );

        }

        if (
            userId === receiverId
        ) {

            throw new AppError(
                "You cannot chat with yourself",
                400
            );

        }

        let conversation =
            await this.conversationRepository
                .findDirectConversation(
                    userId,
                    receiverId
                );

        if (!conversation) {

            conversation =
                await this.conversationRepository
                    .createDirectConversation(
                        user
                    );

            await this.conversationMemberRepository
                .addMember(
                    conversation,
                    user
                );

            await this.conversationMemberRepository
                .addMember(
                    conversation,
                    receiver
                );

        }

        return conversation;

    }

    async joinGroupConversation(
        userId: number,
        conversationId: number
    ) {

        const conversation =
            await this.conversationRepository.findById(
                conversationId,
                userId
            );

        if (!conversation) {

            throw new AppError(
                "Conversation not found",
                404
            );

        }

        if (
            conversation.type !==
            ConversationType.GROUP
        ) {

            throw new AppError(
                "This is not a group conversation",
                400
            );

        }

        return conversation;
    }

}