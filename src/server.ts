import "reflect-metadata";
import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { AppDataSource } from "./database/data-source";
import { ChatGateway } from "./modules/Chat/gateway/chat.gateway";
import { authenticateSocket } from "./socket/socket-auth";
import { connectRabbitMQ } from "./common/rabbitmq/rabbitmq";
import { startMailConsumer } from "./modules/Mails/mail.consumer";
import { connectRedis } from "./common/redis/redis";
const PORT =
    process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {

        console.log("DB connected");

        const server =
            http.createServer(app);

        const io =
            new Server(server, {

                cors: {

                    origin: "*"

                }

            });

        // Đăng ký middleware Socket.IO
        io.use(
            authenticateSocket
        );

        const chatGateway =
            new ChatGateway(io);

        chatGateway.initialize();

        await connectRabbitMQ();
        startMailConsumer();
        console.log("RabbitMQ connected");
        await connectRedis();
        console.log("Redis connected");
        server.listen(PORT, () => {

            console.log(
                `Server running on port ${PORT}`
            );

        });

    })
    .catch((err) => {

        console.log(
            "DB error:",
            err
        );

    });

