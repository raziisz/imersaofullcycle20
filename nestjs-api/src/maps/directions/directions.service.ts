import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import {
  DirectionsRequest,
  Client as GoogleMapsClient,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DirectionsService {
  constructor(
    private googleMapsClient: GoogleMapsClient,
    private configService: EnvConfigService,
  ) {}
  async getDirections(originId: string, destinationId: string) {
    const requestParams: DirectionsRequest['params'] = {
      origin: `place_id:${originId}`,
      destination: `place_id:${destinationId}`,
      mode: TravelMode.driving,
      key: this.configService.getMapApiKey(),
    };
    const { data } = await this.googleMapsClient.directions({
      params: requestParams,
    });

    return {
      ...data,
      request: {
        origin: {
          place_id: requestParams.origin,
          location: {
            lat: data.routes[0].legs[0].start_location.lat,
            lng: data.routes[0].legs[0].start_location.lng,
          },
        },
        destination: {
          place_id: requestParams.destination,
          location: {
            lat: data.routes[0].legs[0].end_location.lat,
            lng: data.routes[0].legs[0].end_location.lng,
          },
        },
        mode: requestParams.mode,
      },
    };
  }
}
