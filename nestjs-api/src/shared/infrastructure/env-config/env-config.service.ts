import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}
  getHostName(): string {
    return this.configService.get<string>('HOSTNAME');
  }
  getKafkaBroker(): string {
    return this.configService.get<string>('KAFKA_BROKER');
  }
  getMapApiKey(): string {
    return this.configService.get<string>('MAPS_API_KEY');
  }

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
