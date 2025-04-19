"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  // Map state
  const [map, setMap] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);
  const [shouldCalculateRoute, setShouldCalculateRoute] = useState(false);

  // Form state
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Handle map ready event
  const handleMapReady = useCallback((mapInstance) => {
    console.log("Map instance ready:", !!mapInstance);
    setMap(mapInstance);
  }, []);

  // Handle destination selection
  const handleSelectDestination = useCallback(
    (place) => {
      if (!map) {
        console.log("Map not ready for adding destination");
        return;
      }

      try {
        console.log("Adding destination:", place.properties.name);
        const coordinates = place.geometry.coordinates;
        // Leaflet uses [lat, lng] while GeoJSON uses [lng, lat]
        const latLng = [coordinates[1], coordinates[0]];

        setDestinationLatLng(latLng);

        // Add to destinations list for the form
        const newDestination = {
          name: place.properties.name,
          coordinates: latLng,
          address: [
            place.properties.city,
            place.properties.state,
            place.properties.country,
          ]
            .filter(Boolean)
            .join(", "),
        };

        setDestinations((prev) => [...prev, newDestination]);

        // Add marker - using the map's Leaflet instance
        if (typeof window !== "undefined" && window.L) {
          const newMarker = window.L.marker(latLng)
            .addTo(map)
            .bindPopup(place.properties.name)
            .openPopup();

          setMarkers((prev) => {
            const newMarkers = [...prev, newMarker];
            console.log("Updated markers count:", newMarkers.length);

            // Flag that we should calculate a route
            if (newMarkers.length >= 2) {
              setShouldCalculateRoute(true);
            }

            return newMarkers;
          });
        }
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    },
    [map]
  );

  // Calculate route using OSRM
  const calculateRoute = useCallback(async () => {
    if (!map || markers.length < 2) {
      console.log(
        "Cannot calculate route: map not ready or not enough markers"
      );
      return;
    }

    try {
      console.log("Calculating route with markers:", markers.length);

      // Get all marker positions
      const waypoints = markers.map((marker) => {
        const latlng = marker.getLatLng();
        return `${latlng.lng},${latlng.lat}`;
      });

      // Add the new destination if not already included in markers
      if (destinationLatLng && markers.length === 1) {
        waypoints.push(`${destinationLatLng[1]},${destinationLatLng[0]}`);
      }

      if (waypoints.length < 2) {
        console.log("Not enough waypoints to calculate route");
        return;
      }

      console.log("Fetching route with waypoints:", waypoints);

      // Call OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${waypoints.join(
          ";"
        )}?overview=full&geometries=geojson`
      );

      const data = await response.json();
      console.log("Route data received:", data);

      if (data.routes && data.routes.length > 0) {
        // Remove previous route if exists
        if (route) {
          try {
            map.removeLayer(route);
          } catch (err) {
            console.error("Error removing previous route:", err);
          }
        }

        // Add new route
        if (typeof window !== "undefined" && window.L) {
          try {
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
            console.log("Route displayed successfully");
          } catch (err) {
            console.error("Error displaying route:", err);
          }
        }
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [map, markers, route, destinationLatLng]);

  // Effect to calculate route when markers change
  useEffect(() => {
    if (shouldCalculateRoute && markers.length >= 2) {
      console.log("Triggering route calculation from effect");
      calculateRoute();
      setShouldCalculateRoute(false);
    }
  }, [shouldCalculateRoute, markers.length, calculateRoute]);

  // Clear all markers and routes
  const handleClearMap = useCallback(() => {
    if (!map) return;

    try {
      console.log("Clearing map...");
      // Remove markers
      markers.forEach((marker) => {
        try {
          map.removeLayer(marker);
        } catch (err) {
          console.error("Error removing marker:", err);
        }
      });
      setMarkers([]);

      // Remove route
      if (route) {
        try {
          map.removeLayer(route);
        } catch (err) {
          console.error("Error removing route:", err);
        }
        setRoute(null);
      }

      // Reset destination
      setDestinationLatLng(null);
      setShouldCalculateRoute(false);
      setDestinations([]);

      console.log("Map cleared successfully");
    } catch (error) {
      console.error("Error clearing map:", error);
    }
  }, [map, markers, route]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Plan Your Trip</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trip Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Trip Name
              </label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter a name for your trip"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Add Destination
              </label>
              <DestinationSearch
                onSelectDestination={handleSelectDestination}
              />
            </div>

            {/* Destinations List */}
            {destinations.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Your Destinations
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <ul className="divide-y">
                    {destinations.map((dest, index) => (
                      <li
                        key={index}
                        className="p-2 flex justify-between items-center hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{dest.name}</div>
                          {dest.address && (
                            <div className="text-xs text-gray-500">
                              {dest.address}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            // Remove this destination
                            setDestinations((prev) =>
                              prev.filter((_, i) => i !== index)
                            );

                            // Also remove the corresponding marker if possible
                            if (markers[index] && map) {
                              try {
                                map.removeLayer(markers[index]);
                                setMarkers((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );

                                // Recalculate route if needed
                                if (markers.length > 2) {
                                  setShouldCalculateRoute(true);
                                }
                              } catch (err) {
                                console.error("Error removing marker:", err);
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Trip Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your trip"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearMap}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Clear Map
              </button>
              <button
                onClick={() => {
                  // Save trip logic
                  setIsSaving(true);

                  const tripData = {
                    name: tripName,
                    startDate,
                    endDate,
                    description,
                    destinations,
                    createdAt: new Date().toISOString(),
                  };

                  console.log("Saving trip:", tripData);

                  // Simulate API call
                  setTimeout(() => {
                    setIsSaving(false);
                    alert("Trip saved successfully!");

                    // Reset form after saving
                    setTripName("");
                    setStartDate("");
                    setEndDate("");
                    setDescription("");
                    handleClearMap();
                  }, 1500);

                  // In a real app, you would save this to a database
                  // For now, we'll just simulate an API call
                }}
                disabled={!tripName || destinations.length < 1 || isSaving}
                className={`px-4 py-2 rounded flex items-center justify-center ${
                  !tripName || destinations.length < 1 || isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Trip"
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">How to Use:</h3>
            <ol className="list-decimal pl-5 text-sm text-gray-600">
              <li>Fill in your trip details</li>
              <li>Search for destinations to add to your route</li>
              <li>The map will automatically calculate the best route</li>
              <li>Save your trip when you're done</li>
            </ol>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="border rounded-lg overflow-hidden shadow-md h-[400px] lg:h-[600px] sticky top-4">
          <MapView
            onMapReady={handleMapReady}
            destinationLatLng={destinationLatLng}
          />
        </div>
      </div>
    </div>
  );
}
