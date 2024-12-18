import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapsModule } from './maps/maps.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { RoutesModule } from './routes/routes.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [MapsModule, EnvConfigModule, RoutesModule, DatabaseModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
