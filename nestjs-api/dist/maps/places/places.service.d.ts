import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
export declare class PlacesService {
    private googleMapsClient;
    private configService;
    constructor(googleMapsClient: GoogleMapsClient, configService: EnvConfigService);
    findPlaces(text: string): Promise<import("@googlemaps/google-maps-services-js").FindPlaceFromTextResponseData>;
}
