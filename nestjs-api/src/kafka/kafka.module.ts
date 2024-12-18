import { Inject, Module, OnModuleInit } from '@nestjs/common';
import * as kafkaLib from '@confluentinc/kafka-javascript';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';

@Module({
  imports: [EnvConfigModule],
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (configService: EnvConfigService) =>
        new kafkaLib.KafkaJS.Kafka({
          'bootstrap.servers': configService.getKafkaBroker(),
        }).producer(),
      inject: [EnvConfigService],
    },
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class KafkaModule implements OnModuleInit {
  constructor(
    @Inject('KAFKA_PRODUCER') private kafkaProducer: kafkaLib.KafkaJS.Producer,
  ) {}
  async onModuleInit() {
    await this.kafkaProducer.connect();
  }
}
