import { Server, Socket } from "socket.io";
import { ChatService } from "../service/chat.service";
import { CreateMessageDto } from "../dto/create-message.dto";


export class ChatGateway {

    private chatService =
        new ChatService();

    constructor(
        private io: Server
    ) { }

    initialize() {

        this.io.on(

            "connection",

            (socket: Socket) => {

                console.log(
                    `Client connected: ${socket.id}`
                );

                this.registerConversationEvents(
                    socket
                );

                this.registerMessageEvents(
                    socket
                );

                socket.on(

                    "disconnect",

                    () => {

                        console.log(
                            `Client disconnected: ${socket.id}`
                        );

                    }

                );

            }

        );

    }

    private registerConversationEvents(
        socket: Socket
    ) {
        socket.on(
            "join-group-conversation",
            async (payload) => {

                try {

                    const conversation =
                        await this.chatService
                            .joinGroupConversation(
                                socket.data.userId,
                                payload.conversationId
                            );

                    socket.join(
                        `conversation:${conversation.id}`
                    );

                    socket.emit(
                        "joined-group-conversation",
                        {
                            conversationId:
                                conversation.id
                        }
                    );

                } catch (error) {

                    socket.emit(
                        "chat-error",
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                        }
                    );

                }

            }
        );
        socket.on(
            "join-conversation",
            async (payload) => {

                try {

                    const conversation =
                        await this.chatService.joinConversation(

                            socket.data.userId,

                            payload.receiverId

                        );

                    socket.join(
                        `conversation:${conversation.id}`
                    );

                    socket.emit(
                        "joined-conversation",
                        {
                            conversationId: conversation.id
                        }
                    );

                } catch (error) {

                    socket.emit(
                        "chat-error",
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                        }
                    );

                }

            }
        );

        socket.on(

            "leave-conversation",

            (
                conversationId: number
            ) => {

                socket.leave(
                    `conversation:${conversationId}`
                );

            }

        );

    }

    private registerMessageEvents(
        socket: Socket
    ) {
        socket.on(
            "send-direct-message",
            async (payload) => {

                try {

                    const result =
                        await this.chatService
                            .sendDirectMessage(

                                socket.data.userId,

                                payload.receiverId,

                                payload.content

                            );

                    this.io
                        .to(
                            `conversation:${result.conversation.id}`
                        )
                        .emit(
                            "new-message",
                            result.message
                        );

                } catch (error) {

                    socket.emit(
                        "chat-error",
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                        }
                    );

                }

            }
        );
        socket.on(

            "send-message",

            async (payload: CreateMessageDto) => {

                try {

                    const message =
                        await this.chatService.sendMessage(

                            socket.data.userId,

                            payload.conversationId,

                            payload.content

                        );

                    this.io
                        .to(
                            `conversation:${payload.conversationId}`
                        )
                        .emit(
                            "new-message",
                            message
                        );

                } catch (error) {

                    socket.emit(
                        "chat-error",
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                        }
                    );

                }

            }

        );

        socket.on(
            "get-group-messages",
            async (payload) => {

                try {

                    const messages =
                        await this.chatService
                            .getGroupMessages(

                                payload.token,

                                payload.conversationId,

                                payload.limit,

                                payload.offset

                            );

                    socket.emit(
                        "group-messages",
                        messages
                    );

                } catch (error) {

                    socket.emit(
                        "chat-error",
                        {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                        }
                    );

                }

            }
        );

    }




}