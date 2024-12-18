"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const kafka_server_1 = require("../kafka/kafka-server");
const env_config_module_1 = require("../shared/infrastructure/env-config/env-config.module");
const env_config_service_1 = require("../shared/infrastructure/env-config/env-config.service");
const app_module_1 = require("../app.module");
async function bootstrap() {
    const appConfigContext = await core_1.NestFactory.createApplicationContext(env_config_module_1.EnvConfigModule);
    const envConfigService = appConfigContext.get(env_config_service_1.EnvConfigService);
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        strategy: new kafka_server_1.KafkaServer({
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
//# sourceMappingURL=kafka.cmd.js.map