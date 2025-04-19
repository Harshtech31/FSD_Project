"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useSocket } from "./socket-provider";
import { Card } from "./ui/card";

interface TripMapProps {
  tripId: string;
  source: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export function TripMap({ tripId, source, destination }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        const google = await loader.load();

        const map = new google.maps.Map(mapRef.current, {
          center: source,
          zoom: 12,
        });

        // Add markers for source and destination
        new google.maps.Marker({
          position: source,
          map,
          title: "Start",
        });

        new google.maps.Marker({
          position: destination,
          map,
          title: "End",
        });

        // Draw route
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        directionsService.route(
          {
            origin: source,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            }
          }
        );

        setMap(map);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();

    // Join trip room for real-time updates
    socket.emit("joinTrip", tripId);

    // Listen for location updates
    socket.on("locationUpdate", (data) => {
      // Update vehicle position on map
      // This would show real-time movement of the vehicle
    });

    return () => {
      socket.off("locationUpdate");
    };
  }, [tripId, source, destination, socket]);

  return (
    <Card>
      <div ref={mapRef} className="w-full h-[400px] rounded-lg" />
    </Card>
  );
}
