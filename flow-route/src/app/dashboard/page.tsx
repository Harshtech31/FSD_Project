'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Trip } from '@prisma/client';

export default function DashboardPage() {
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const [myTripsRes, availableTripsRes] = await Promise.all([
          fetch('/api/trips/my-trips'),
          fetch('/api/trips/available'),
        ]);

        if (myTripsRes.ok) {
          const data = await myTripsRes.json();
          setMyTrips(data);
        }

        if (availableTripsRes.ok) {
          const data = await availableTripsRes.json();
          setAvailableTrips(data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* My Trips Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Trips</h2>
          {myTrips.length === 0 ? (
            <p className="text-gray-500">You haven't created any trips yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {trip.startPoint} → {trip.endPoint}
                      </h3>
                      <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {trip.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Date: {new Date(trip.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Seats: {trip.seats}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${trip.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Trips Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Available Trips
          </h2>
          {availableTrips.length === 0 ? (
            <p className="text-gray-500">No available trips at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {trip.startPoint} → {trip.endPoint}
                      </h3>
                      <span className="px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Date: {new Date(trip.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Seats: {trip.seats}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${trip.price}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          // Handle join trip
                        }}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Join Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
} 