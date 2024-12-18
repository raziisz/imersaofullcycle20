import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoutesService } from '../routes.service';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesDriverGateway {
  @WebSocketServer()
  server: Server;
  private logger = new Logger(RoutesDriverGateway.name);
  constructor(private routesService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleMessage(client: any, payload: any) {
    const { route_id } = payload;
    const route = await this.routesService.findOne(route_id);
    //@ts-expect-error - routes has not been defiuned
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

  emitNewPoints(payload: { route_id: string; lat: number; lng: number }) {
    const { route_id, lat, lng } = payload;

    this.logger.log(
      `Emitting new points for route ${route_id} - ${lat}, ${lng}`,
    );

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
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
