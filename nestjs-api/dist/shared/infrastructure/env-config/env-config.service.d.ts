import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';
export declare class EnvConfigService implements EnvConfig {
    private configService;
    constructor(configService: ConfigService);
    getHostName(): string;
    getKafkaBroker(): string;
    getMapApiKey(): string;
    getAppPort(): number;
    getNodeEnv(): string;
}
