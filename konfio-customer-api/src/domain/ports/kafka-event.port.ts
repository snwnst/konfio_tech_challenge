export interface KafkaEventPort {
  publish(topic: string, message: any): Promise<void>;
  subscribe(
    topic: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void>;
}
