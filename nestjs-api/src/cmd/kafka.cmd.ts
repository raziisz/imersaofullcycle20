import { NestFactory } from '@nestjs/core';
import { KafkaServer } from '@/kafka/kafka-server';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const appConfigContext =
    await NestFactory.createApplicationContext(EnvConfigModule);

  const envConfigService = appConfigContext.get(EnvConfigService);
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new KafkaServer({
      server: {
        'bootstrap.servers': envConfigService.getKafkaBroker(),
      },
      consumer: {
        'group.id': 'nest-group',
        'client.id': `nest-group-${envConfigService.getHostName()}`,
        'max.poll.interval.ms': 10000,
        'session.timeout.ms': 10000,
      },
    }),
  });
  await app.listen();
}
bootstrap();
