"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Trip {
  id: string
  from: string
  to: string
  date: string
  time: string
  vehicleType: string
  seats: number
  costPerPerson: number
  driver: {
    id: string
    name: string
    avatar: string
  }
  status: string
  passengers: any[]
  createdAt: string
}

export default function TripDetailsPage() {
  const params = useParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        console.log('Fetching trip with ID:', params.id)
        const response = await fetch(`http://localhost:5000/api/trips/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          throw new Error(errorData.error || "Failed to fetch trip")
        }
        
        const data = await response.json()
        console.log('Received trip data:', data)
        setTrip(data)
      } catch (error) {
        console.error('Error fetching trip:', error)
        setError(error instanceof Error ? error.message : "Failed to load trip details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Loading trip details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">{error}</div>
        <div className="text-center mt-4">
          <Link href="/trips" className="text-primary hover:underline">
            Back to trips
          </Link>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Trip not found</div>
        <div className="text-center mt-4">
          <Link href="/trips" className="text-primary hover:underline">
            Back to trips
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to trips
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage 
                    src={trip.driver?.avatar || "/avatars/default.png"} 
                    alt={trip.driver?.name || "Driver"} 
                  />
                  <AvatarFallback>
                    {trip.driver?.name?.[0] || "D"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {trip.driver?.name || "Driver"}&apos;s Trip
                  </CardTitle>
                  <Badge variant="secondary">{trip.vehicleType}</Badge>
                </div>
              </div>
              <p className="font-semibold">₹{trip.costPerPerson}/person</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{trip.from} → {trip.to}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trip.date).toLocaleDateString()} at {trip.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{trip.seats} seats available</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">Join Trip</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

