"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaServer = void 0;
const microservices_1 = require("@nestjs/microservices");
const kafkaLib = __importStar(require("@confluentinc/kafka-javascript"));
const common_1 = require("@nestjs/common");
const kafka_context_1 = require("./kafka-context");
class KafkaServer extends microservices_1.Server {
    options;
    logger = new common_1.Logger(KafkaServer.name);
    kafkaInst;
    consumer;
    constructor(options) {
        super();
        this.options = options;
    }
    async listen(callback) {
        this.kafkaInst = new kafkaLib.KafkaJS.Kafka(this.options.server);
        this.consumer = this.kafkaInst.consumer(this.options.consumer);
        await this.consumer.connect();
        await this.bindEvents();
        callback();
    }
    async bindEvents() {
        const registeredPatterns = [...this.messageHandlers.keys()];
        if (registeredPatterns.length > 0) {
            await this.consumer.subscribe({
                topics: registeredPatterns,
            });
        }
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const handler = this.getHandlerByPattern(topic);
                if (!handler) {
                    this.logger.error(`No handler for topic ${topic}`);
                    return;
                }
                const kafkaContext = new kafka_context_1.KafkaContext(message, JSON.parse(message.value.toString()), topic, partition, this.consumer);
                await handler(kafkaContext);
            },
        });
    }
    async close() {
        console.log('Closing Kafka connection');
        await this.consumer?.disconnect();
        this.consumer = null;
    }
}
exports.KafkaServer = KafkaServer;
//# sourceMappingURL=kafka-server.js.map