"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DestinationSearch from "@/components/DestinationSearch";

// Dynamically import MapView with no SSR to avoid Leaflet window errors
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

export default function RoutePlanner() {
  const [map, setMap] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);

  // Handle map ready event
  const handleMapReady = (mapInstance) => {
    setMap(mapInstance);
  };

  // Handle destination selection
  const handleSelectDestination = (place) => {
    if (!map) return;

    const coordinates = place.geometry.coordinates;
    // Leaflet uses [lat, lng] while GeoJSON uses [lng, lat]
    const latLng = [coordinates[1], coordinates[0]];

    setDestinationLatLng(latLng);

    // Add marker - using the map's Leaflet instance
    const newMarker = window.L.marker(latLng)
      .addTo(map)
      .bindPopup(place.properties.name)
      .openPopup();

    setMarkers((prev) => [...prev, newMarker]);

    // If we have 2 or more markers, calculate route
    if (markers.length >= 1) {
      calculateRoute();
    }
  };

  // Calculate route using OSRM
  const calculateRoute = async () => {
    if (markers.length < 2) return;

    try {
      // Get all marker positions
      const waypoints = markers.map((marker) => {
        const latlng = marker.getLatLng();
        return `${latlng.lng},${latlng.lat}`;
      });

      // Add the new destination
      if (destinationLatLng) {
        waypoints.push(`${destinationLatLng[1]},${destinationLatLng[0]}`);
      }

      // Call OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${waypoints.join(
          ";"
        )}?overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        // Remove previous route if exists
        if (route) {
          map.removeLayer(route);
        }

        // Add new route
        const newRoute = window.L.geoJSON(data.routes[0].geometry, {
          style: {
            color: "#0066ff",
            weight: 5,
            opacity: 0.7,
          },
        }).addTo(map);

        setRoute(newRoute);

        // Fit map to route bounds
        map.fitBounds(newRoute.getBounds(), { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  // Clear all markers and routes
  const handleClearMap = () => {
    if (!map) return;

    // Remove markers
    markers.forEach((marker) => map.removeLayer(marker));
    setMarkers([]);

    // Remove route
    if (route) {
      map.removeLayer(route);
      setRoute(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Route Planner</h1>

      <div className="mb-4">
        <DestinationSearch onSelectDestination={handleSelectDestination} />
      </div>

      <div className="mb-4">
        <button
          onClick={handleClearMap}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Map
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <MapView
          onMapReady={handleMapReady}
          destinationLatLng={destinationLatLng}
        />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">How to Use:</h2>
        <ol className="list-decimal pl-5">
          <li>Search for a destination in the search box</li>
          <li>Select a location from the dropdown to add it to the map</li>
          <li>Add at least two locations to calculate a route</li>
          <li>Use the "Clear Map" button to start over</li>
        </ol>
      </div>
    </div>
  );
}
