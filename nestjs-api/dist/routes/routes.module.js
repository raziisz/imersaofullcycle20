"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesModule = void 0;
const common_1 = require("@nestjs/common");
const routes_service_1 = require("./routes.service");
const routes_controller_1 = require("./routes.controller");
const database_module_1 = require("../shared/infrastructure/database/database.module");
const maps_module_1 = require("../maps/maps.module");
const routes_driver_service_1 = require("./routes-driver/routes-driver.service");
const routes_driver_gateway_1 = require("./routes-driver/routes-driver.gateway");
const kafka_module_1 = require("../kafka/kafka.module");
const routes_consumer_1 = require("./routes.consumer");
const routes_driver_consumer_1 = require("./routes-driver/routes-driver.consumer");
const axios_1 = require("@nestjs/axios");
let RoutesModule = class RoutesModule {
};
exports.RoutesModule = RoutesModule;
exports.RoutesModule = RoutesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, maps_module_1.MapsModule, kafka_module_1.KafkaModule, axios_1.HttpModule],
        controllers: [routes_controller_1.RoutesController, routes_consumer_1.RoutesConsumer, routes_driver_consumer_1.RoutesDriverConsumer],
        providers: [routes_service_1.RoutesService, routes_driver_service_1.RoutesDriverService, routes_driver_gateway_1.RoutesDriverGateway],
    })
], RoutesModule);
//# sourceMappingURL=routes.module.js.map