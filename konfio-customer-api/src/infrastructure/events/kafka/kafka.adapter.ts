import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { Logger } from '../../logger/logger.interface';

@Injectable()
export class KafkaAdapter
  implements KafkaEventPort, OnModuleInit, OnModuleDestroy
{
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private subscriptions: Map<string, (message: any) => Promise<void>>;

  constructor(
    @Inject('Logger')
    private readonly logger: Logger,
  ) {
    this.kafka = new Kafka({
      clientId: 'konfio-customer-api',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'konfio-customer-group' });
    this.subscriptions = new Map();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.logger.info('Kafka adapter initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing Kafka adapter', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.logger.info('Kafka adapter disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka adapter', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    try {
      this.logger.info('Publishing message to Kafka', { topic });
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      this.logger.info('Message published successfully', { topic });
    } catch (error) {
      this.logger.error('Error publishing message to Kafka', {
        error: error instanceof Error ? error.message : String(error),
        topic,
      });
      throw error;
    }
  }

  async subscribe(
    topic: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      this.logger.info('Subscribing to Kafka topic', { topic });

      if (this.subscriptions.has(topic)) {
        this.logger.warn('Already subscribed to topic', { topic });
        return;
      }

      this.subscriptions.set(topic, callback);

      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const value = message.value?.toString();
            if (!value) {
              this.logger.warn('Received empty message', { topic, partition });
              return;
            }

            const parsedMessage: unknown = JSON.parse(value);
            this.logger.info('Received message from Kafka', {
              topic,
              message: parsedMessage,
            });

            await callback(parsedMessage);

            this.logger.info('Message processed successfully', { topic });
          } catch (error) {
            this.logger.error('Error processing Kafka message', {
              error: error instanceof Error ? error.message : String(error),
              topic,
              partition,
            });
          }
        },
      });

      this.logger.info('Successfully subscribed to topic', { topic });
    } catch (error) {
      this.logger.error('Error subscribing to Kafka topic', {
        error: error instanceof Error ? error.message : String(error),
        topic,
      });
      throw error;
    }
  }
}
