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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/infrastructure/database/prisma/prisma.service");
const directions_service_1 = require("../maps/directions/directions.service");
const kafkaLib = __importStar(require("@confluentinc/kafka-javascript"));
let RoutesService = class RoutesService {
    prismaService;
    directionsService;
    kafkaProducer;
    constructor(prismaService, directionsService, kafkaProducer) {
        this.prismaService = prismaService;
        this.directionsService = directionsService;
        this.kafkaProducer = kafkaProducer;
    }
    async create(createRouteDto) {
        const { available_travel_modes, geocoded_waypoints, routes, request } = await this.directionsService.getDirections(createRouteDto.source_id, createRouteDto.destination_id);
        const legs = routes[0].legs[0];
        const route = await this.prismaService.route.create({
            data: {
                name: createRouteDto.name,
                source: {
                    name: legs.start_address,
                    location: {
                        lat: legs.start_location.lat,
                        lng: legs.start_location.lng,
                    },
                },
                destination: {
                    name: legs.end_address,
                    location: {
                        lat: legs.end_location.lat,
                        lng: legs.end_location.lng,
                    },
                },
                duration: legs.duration.value,
                distance: legs.distance.value,
                directions: JSON.parse(JSON.stringify({
                    available_travel_modes,
                    geocoded_waypoints,
                    routes,
                    request,
                })),
            },
        });
        await this.kafkaProducer.send({
            topic: 'route',
            messages: [
                {
                    value: JSON.stringify({
                        id: route.id,
                        event: 'RouteCreated',
                        distance: legs.distance.value,
                        directions: legs.steps.reduce((acc, step) => {
                            acc.push({
                                lat: step.start_location.lat,
                                lng: step.start_location.lng,
                            });
                            acc.push({
                                lat: step.end_location.lat,
                                lng: step.end_location.lng,
                            });
                            return acc;
                        }, []),
                    }),
                },
            ],
        });
        return route;
    }
    async startRoute(id) {
        await this.prismaService.route.findUniqueOrThrow({
            where: { id },
        });
        await this.kafkaProducer.send({
            topic: 'route',
            messages: [
                {
                    value: JSON.stringify({
                        event: 'DeliveryStarted',
                        route_id: id,
                    }),
                },
            ],
        });
    }
    findAll() {
        return this.prismaService.route.findMany();
    }
    findOne(id) {
        return this.prismaService.route.findUniqueOrThrow({
            where: { id },
        });
    }
    async update(id, updateRouteDto) {
        return this.prismaService.route.update({
            where: { id },
            data: updateRouteDto,
        });
    }
    remove(id) {
        return `This action removes a #${id} route`;
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('KAFKA_PRODUCER')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        directions_service_1.DirectionsService, Object])
], RoutesService);
//# sourceMappingURL=routes.service.js.map