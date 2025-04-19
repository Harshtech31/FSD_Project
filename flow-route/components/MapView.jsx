import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ onMapReady, destinationLatLng }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

      // Google Streets layer
      const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(mapInstanceRef.current);

      // Google Satellite layer
      const googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      });

      // Layer control
      L.control
        .layers({
          'Google Streets': googleStreets,
          'Google Satellite': googleSat,
        })
        .addTo(mapInstanceRef.current);

      // Pass map instance to parent
      if (onMapReady) {
        onMapReady(mapInstanceRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  // Update map view when destination changes
  useEffect(() => {
    if (destinationLatLng && mapInstanceRef.current) {
      mapInstanceRef.current.setView(destinationLatLng, 12);
    }
  }, [destinationLatLng]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] z-0"
    ></div>
  );
};

export default MapView;
