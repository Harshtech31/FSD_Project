import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

// Only import Leaflet on the client side
let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

const MapView = ({ onMapReady, destinationLatLng }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  // Initialize map when component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Wait for the DOM to be fully ready
    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        // Fix for Leaflet icon paths
        if (L && L.Icon && L.Icon.Default) {
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            iconUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          });
        }

        // Create map instance
        if (!mapInstanceRef.current && L) {
          // Create the map with OpenStreetMap tiles
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [20.5937, 78.9629],
            zoom: 5,
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
          });

          // OpenStreetMap layer
          const osmLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
            }
          ).addTo(mapInstanceRef.current);

          // Terrain layer
          const terrainLayer = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
              maxZoom: 17,
            }
          );

          // Layer control
          L.control
            .layers({
              OpenStreetMap: osmLayer,
              Terrain: terrainLayer,
            })
            .addTo(mapInstanceRef.current);

          // Pass map instance to parent
          if (onMapReady) {
            onMapReady(mapInstanceRef.current);
          }

          setMapInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      } finally {
        setMapLoading(false);
      }
    };

    // Initialize with a delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 500);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  // Update map view when destination changes
  useEffect(() => {
    if (destinationLatLng && mapInstanceRef.current && mapInitialized) {
      try {
        mapInstanceRef.current.setView(destinationLatLng, 12);
      } catch (error) {
        console.error("Error setting map view:", error);
      }
    }
  }, [destinationLatLng, mapInitialized]);

  return (
    <div className="relative w-full h-[600px]">
      {mapLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <div className="text-lg font-semibold">Loading map...</div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full z-0"
        style={{ visibility: mapLoading ? "hidden" : "visible" }}
      ></div>
    </div>
  );
};

export default MapView;
