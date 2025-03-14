import { FeatureCollection } from "geojson";
import L from "leaflet";

// API key should be handled via environment variables
const API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;

// Types
import { Feature, Geometry, GeoJsonProperties } from "geojson";

export interface RouteResponse
  extends FeatureCollection<Geometry, GeoJsonProperties> {
  features: Array<
    Feature<
      Geometry,
      {
        summary?: {
          distance: number;
          duration: number;
        };
      }
    >
  >;
}

export interface GeocodingFeature {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name?: string;
    label?: string;
  };
}

export interface GeocodingResponse {
  features: GeocodingFeature[];
}

export interface RouteInfoSummary {
  distance: string;
  duration: string;
}

/**
 * Add OpenStreetMap tile layer to the map
 */
export const addOpenStreetMapTileLayer = (map: L.Map): L.TileLayer => {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
};

/**
 * Search for a location using the OpenRouteService geocoding API
 */
export const searchLocation = async (
  searchQuery: string
): Promise<GeocodingResponse> => {
  const response = await fetch(
    `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(
      searchQuery
    )}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, application/geo+json, application/gpx+xml",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get a route between multiple coordinates
 * @param coordinates Array of coordinates in format [longitude, latitude]
 */
export const getRoute = async (
  coordinates: [number, number][]
): Promise<RouteResponse> => {
  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ coordinates }),
    }
  );

  if (!response.ok) {
    throw new Error(`Route API error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Parse coordinates from string format (e.g. "-98.5795, 39.8283")
 * @returns [longitude, latitude] tuple
 */
export const parseCoordinates = (coordStr: string): [number, number] => {
  try {
    const [lng, lat] = coordStr
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    if (isNaN(lng) || isNaN(lat)) {
      throw new Error("Invalid coordinates format");
    }

    return [lng, lat];
  } catch (err) {
    console.error("Error parsing coordinates:", err);
    throw new Error("Could not parse coordinates");
  }
};

/**
 * Format route information from API response
 */
export const formatRouteInfo = (
  routeData: RouteResponse
): RouteInfoSummary | null => {
  if (routeData.features && routeData.features.length > 0) {
    const summary = routeData.features[0].properties.summary;

    if (summary) {
      // Convert distance from meters to miles
      const distanceInMiles = (summary.distance / 1609.34).toFixed(1);

      // Format duration from seconds to hours and minutes
      const hours = Math.floor(summary.duration / 3600);
      const minutes = Math.floor((summary.duration % 3600) / 60);

      let durationText = "";
      if (hours > 0) {
        durationText = `${hours} hr ${minutes} min`;
      } else {
        durationText = `${minutes} min`;
      }

      return {
        distance: `${distanceInMiles} miles`,
        duration: durationText,
      };
    }
  }

  return null;
};
