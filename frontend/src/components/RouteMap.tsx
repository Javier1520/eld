import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  parseCoordinates,
  getRoute,
  formatRouteInfo,
  RouteInfoSummary,
} from "@/services/openRouteApi";

interface RouteMapProps {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  onClose: () => void;
}

const RouteMap: React.FC<RouteMapProps> = ({
  currentLocation,
  pickupLocation,
  dropoffLocation,
  onClose,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfoSummary | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Parse all coordinates [lng, lat]
        const current = parseCoordinates(currentLocation);
        const pickup = parseCoordinates(pickupLocation);
        const dropoff = parseCoordinates(dropoffLocation);

        // Create map container
        const mapContainer = document.getElementById("route-map-container");
        if (!mapContainer) return;

        // Initialize map
        if (!mapRef.current) {
          // Center map on the middle point of the three locations
          const avgLat = (current[1] + pickup[1] + dropoff[1]) / 3;
          const avgLng = (current[0] + pickup[0] + dropoff[0]) / 3;

          mapRef.current = L.map("route-map-container").setView(
            [avgLat, avgLng],
            5
          );

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);

          // Add markers for each location
          // Current location marker (blue)
          L.marker([current[1], current[0]], {
            icon: createColoredMarker("#3b82f6"),
          })
            .addTo(mapRef.current)
            .bindPopup("Current Location");

          // Pickup location marker (green)
          L.marker([pickup[1], pickup[0]], {
            icon: createColoredMarker("#10b981"),
          })
            .addTo(mapRef.current)
            .bindPopup("Pickup Location");

          // Dropoff location marker (red)
          L.marker([dropoff[1], dropoff[0]], {
            icon: createColoredMarker("#ef4444"),
          })
            .addTo(mapRef.current)
            .bindPopup("Dropoff Location");

          // Fetch route from OpenRouteService
          const coordinates = [current, pickup, dropoff];

          try {
            const routeData = await getRoute(coordinates);

            // Add route to map
            const route = L.geoJSON(routeData, {
              style: {
                color: "#3b82f6",
                weight: 4,
                opacity: 0.7,
              },
            }).addTo(mapRef.current);

            // Fit map bounds to show the entire route
            mapRef.current.fitBounds(route.getBounds(), { padding: [30, 30] });

            // Process route information
            const formattedRouteInfo = formatRouteInfo(routeData);
            if (formattedRouteInfo) {
              setRouteInfo(formattedRouteInfo);
            }
          } catch (routeError) {
            console.error("Error fetching route:", routeError);
            setError("Failed to fetch route. Please check your coordinates.");
          }
        }
      } catch (mapError) {
        console.error("Error initializing map:", mapError);
        setError("Failed to initialize map. Please check your coordinates.");
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentLocation, pickupLocation, dropoffLocation]);

  // Helper function to create colored markers
  const createColoredMarker = (color: string) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trip Route</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div id="route-map-container" className="h-96 w-full mb-4"></div>

        {isLoading && <div className="text-center py-2">Loading route...</div>}

        {routeInfo && (
          <div className="bg-blue-50 p-3 rounded flex justify-between">
            <div>
              <span className="font-semibold">Distance:</span>{" "}
              {routeInfo.distance}
            </div>
            <div>
              <span className="font-semibold">Estimated Time:</span>{" "}
              {routeInfo.duration}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center">
          <div className="flex gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Current Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Pickup Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Dropoff Location</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteMap;
