import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  searchLocation,
  parseCoordinates,
  addOpenStreetMapTileLayer,
} from "@/services/openRouteApi";

interface MapSelectorProps {
  initialCoordinates?: string;
  onCoordinateSelected: (coordinates: string) => void;
  onClose: () => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({
  initialCoordinates,
  onCoordinateSelected,
  onClose,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<string>(
    initialCoordinates || ""
  );

  // Initialize map
  useEffect(() => {
    // Default coordinates if none provided (centered on US)
    let defaultLat = 39.8283;
    let defaultLng = -98.5795;
    let defaultZoom = 4;

    // Parse initial coordinates if provided
    if (initialCoordinates) {
      try {
        const [lng, lat] = parseCoordinates(initialCoordinates);
        defaultLng = lng;
        defaultLat = lat;
        defaultZoom = 10;
      } catch (error) {
        console.error("Error parsing coordinates:", error);
      }
    }

    // Create map instance
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    if (!mapRef.current) {
      mapRef.current = L.map("map-container").setView(
        [defaultLat, defaultLng],
        defaultZoom
      );

      // Add tile layer using centralized function
      addOpenStreetMapTileLayer(mapRef.current);

      // Add a marker if we have initial coordinates
      if (initialCoordinates) {
        markerRef.current = L.marker([defaultLat, defaultLng]).addTo(
          mapRef.current
        );
      }

      // Handle click event on the map
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const coordinates = `${lng.toFixed(6)}, ${lat.toFixed(6)}`;

        setSelectedCoordinates(coordinates);

        // Update or add marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [initialCoordinates]);

  // Handle search using OpenRouteService geocoding API
  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapRef.current) return;

    try {
      const data = await searchLocation(searchQuery);

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;

        // Update map view
        mapRef.current.setView([lat, lng], 13);

        // Update or add marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        }

        // Update selected coordinates
        const coordinates = `${lng.toFixed(6)}, ${lat.toFixed(6)}`;
        setSelectedCoordinates(coordinates);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleConfirm = () => {
    onCoordinateSelected(selectedCoordinates);
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div id="map-container" className="h-96 w-full mb-4"></div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            Selected: <span className="font-medium">{selectedCoordinates}</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSelector;
