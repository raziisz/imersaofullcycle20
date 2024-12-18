import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { Client as GoogleMapsClient, TravelMode } from '@googlemaps/google-maps-services-js';
export declare class DirectionsService {
    private googleMapsClient;
    private configService;
    constructor(googleMapsClient: GoogleMapsClient, configService: EnvConfigService);
    getDirections(originId: string, destinationId: string): Promise<{
        request: {
            origin: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                location: {
                    lat: number;
                    lng: number;
                };
            };
            destination: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                location: {
                    lat: number;
                    lng: number;
                };
            };
            mode: TravelMode;
        };
        geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
        routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
        available_travel_modes: string[];
        status: import("@googlemaps/google-maps-services-js").Status;
        error_message: string;
        html_attributions?: string[];
        next_page_token?: string;
    }>;
}
