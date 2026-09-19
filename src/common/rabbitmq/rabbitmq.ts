import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
    const connection = await amqp.connect("amqp://localhost");

    channel = await connection.createChannel();

    await channel.assertQueue("send-email");
}

export function getChannel(): amqp.Channel {
    if (!channel) {
        throw new Error("RabbitMQ is not connected");
    }

    return channel;
}