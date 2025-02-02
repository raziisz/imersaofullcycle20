"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoutesDriverGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesDriverGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const routes_service_1 = require("../routes.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let RoutesDriverGateway = RoutesDriverGateway_1 = class RoutesDriverGateway {
    routesService;
    server;
    logger = new common_1.Logger(RoutesDriverGateway_1.name);
    constructor(routesService) {
        this.routesService = routesService;
    }
    async handleMessage(client, payload) {
        const { route_id } = payload;
        const route = await this.routesService.findOne(route_id);
        const { steps } = route.directions.routes[0].legs[0];
        for (const step of steps) {
            const { lat, lng } = step.start_location;
            client.emit(`server:new-points/${route_id}:list`, {
                route_id,
                lat,
                lng,
            });
            client.broadcast.emit('server:new-points:list', {
                route_id,
                lat,
                lng,
            });
            await sleep(2000);
            const { lat: lat2, lng: lng2 } = step.end_location;
            client.emit(`server:new-points/${route_id}:list`, {
                route_id,
                lat: lat2,
                lng: lng2,
            });
            client.broadcast.emit(`server:new-points:list`, {
                route_id,
                lat: lat2,
                lng: lng2,
            });
            await sleep(2000);
        }
    }
    emitNewPoints(payload) {
        const { route_id, lat, lng } = payload;
        this.logger.log(`Emitting new points for route ${route_id} - ${lat}, ${lng}`);
        this.server.emit(`server:new-points/${payload.route_id}:list`, {
            route_id,
            lat,
            lng,
        });
        this.server.emit(`server:new-points:list`, {
            route_id,
            lat,
            lng,
        });
    }
};
exports.RoutesDriverGateway = RoutesDriverGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoutesDriverGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('client:new-points'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoutesDriverGateway.prototype, "handleMessage", null);
exports.RoutesDriverGateway = RoutesDriverGateway = RoutesDriverGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [routes_service_1.RoutesService])
], RoutesDriverGateway);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//# sourceMappingURL=routes-driver.gateway.js.map