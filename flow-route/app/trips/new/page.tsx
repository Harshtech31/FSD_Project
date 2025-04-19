"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/components/socket-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const socket = useSocket();
  const [vehicleType, setVehicleType] = useState("4-wheeler");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const tripData = {
        vehicleType: formData.get("vehicleType"),
        from: formData.get("from"),
        to: formData.get("to"),
        date: formData.get("date"),
        time: formData.get("time"),
        seats: formData.get("seats"),
        costPerPerson: formData.get("cost"),
      };

      console.log("Submitting trip data:", tripData);

      const response = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }

      const data = await response.json();
      console.log("Trip created successfully:", data);

      // Notify other users about new trip
      socket.emit("newTrip", data);

      toast({
        title: "Success",
        description: "Trip created successfully!",
      });

      router.push("/trips");
    } catch (error) {
      console.error("Error creating trip:", error);
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Vehicle Type</Label>
              <RadioGroup
                name="vehicleType"
                defaultValue="4-wheeler"
                onValueChange={setVehicleType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4-wheeler" id="4-wheeler" />
                  <Label htmlFor="4-wheeler">4 Wheeler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2-wheeler" id="2-wheeler" />
                  <Label htmlFor="2-wheeler">2 Wheeler</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" name="from" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" name="to" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">Available Seats</Label>
                <Input id="seats" name="seats" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost per Person</Label>
                <Input id="cost" name="cost" type="number" min="0" required />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
