import { Connection, Channel, Options } from 'amqplib';
import * as amqp from 'amqplib';

export class RabbitMqClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private async ensureConnection(): Promise<void> {
    if (!this.connection) {
      this.connection = (await amqp.connect(
        process.env.RABBITMQ_URI || 'amqp://localhost:5672',
      )) as Connection;
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }
  }

  public async getConnection(): Promise<Connection> {
    await this.ensureConnection();
    return this.connection!;
  }

  public async publishMessage(
    queue: string,
    message: Record<string, any>,
    options?: Options.Publish,
  ): Promise<void> {
    await this.ensureConnection();

    await this.channel!.assertQueue(queue, { durable: true });

    this.channel!.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  }
}
