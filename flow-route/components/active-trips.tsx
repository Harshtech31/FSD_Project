"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"

interface Trip {
  id: number
  from: string
  to: string
  date: string
  time: string
  driver: {
    name: string
    avatar: string
  }
  vehicle: string
  availableSeats: number
  costPerPerson: number
}

export function ActiveTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trips")
        if (!response.ok) throw new Error("Failed to fetch trips")
        const data = await response.json()
        setTrips(data)
      } catch (error) {
        setError("Failed to load trips. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [])

  if (loading) {
    return (
      <section className="py-12">
        <div className="text-center text-muted-foreground">Loading trips...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="text-center text-destructive">{error}</div>
      </section>
    )
  }

  if (trips.length === 0) {
    return (
      <section className="py-12">
        <div className="text-center text-muted-foreground">
          No active trips found.
          <Link href="/trips/new" className="ml-2 text-primary hover:underline">
            Create one?
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="grid md:grid-cols-2 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={trip.driver.avatar} alt={trip.driver.name} />
                    <AvatarFallback>{trip.driver.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{trip.driver.name}&apos;s Trip</CardTitle>
                    <Badge variant="secondary">{trip.vehicle}</Badge>
                  </div>
                </div>
                <p className="font-semibold">₹{trip.costPerPerson}/person</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{trip.from}</p>
                    <p className="text-muted-foreground">to</p>
                    <p className="font-medium">{trip.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <p>
                    {trip.date} at {trip.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <p>{trip.availableSeats} seats available</p>
                </div>
                <Link href={`/trips/${trip.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

