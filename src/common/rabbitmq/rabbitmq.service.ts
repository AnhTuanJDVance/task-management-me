import { getChannel } from "./rabbitmq";

export class RabbitMQService {
  static async publish(queue: string, message: object) {
    const channel = getChannel();

    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message))
    );
  }
}