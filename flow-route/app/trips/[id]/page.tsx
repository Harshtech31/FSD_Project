"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { TripMap } from "@/components/trip-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSocket } from "@/components/socket-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Clock } from "lucide-react"

interface TripDetails {
  id: string
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
  coordinates: {
    source: { lat: number; lng: number }
    destination: { lat: number; lng: number }
  }
  participants: Array<{
    id: string
    name: string
    avatar: string
  }>
}

export default function TripDetailsPage() {
  const params = useParams()
  const socket = useSocket()
  const { toast } = useToast()
  const [trip, setTrip] = useState<TripDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trips/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch trip details")
        const data = await response.json()
        setTrip(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load trip details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTripDetails()
  }, [params.id, toast])

  const handleJoinTrip = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${params.id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) throw new Error("Failed to join trip")

      toast({
        title: "Success",
        description: "You've joined the trip!",
      })

      // Notify other participants
      socket.emit("participantJoined", { tripId: params.id })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join trip",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!trip) {
    return <div>Trip not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={trip.driver.avatar} alt={trip.driver.name} />
                <AvatarFallback>{trip.driver.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{trip.driver.name}&apos;s Trip</CardTitle>
                <Badge variant="secondary">{trip.vehicle}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{trip.costPerPerson}</p>
              <p className="text-sm text-muted-foreground">per person</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
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
                <p>{trip.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p>{trip.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <p>{trip.availableSeats} seats available</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {trip.participants.map((participant) => (
                  <Avatar key={participant.id} className="border-2 border-background">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>

          <TripMap tripId={trip.id} source={trip.coordinates.source} destination={trip.coordinates.destination} />

          <Button className="w-full" disabled={trip.availableSeats === 0} onClick={handleJoinTrip}>
            {trip.availableSeats === 0 ? "Trip Full" : "Join Trip"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

