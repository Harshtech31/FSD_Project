"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActiveTrips } from "@/components/active-trips";
import { AuthGuard } from "@/components/auth-guard";

export default function TripsPage() {
  return (
    <div className="space-y-8">
      <AuthGuard>
        <Card>
          <CardHeader>
            <CardTitle>Find a Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" placeholder="Enter starting point" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" placeholder="Enter destination" />
              </div>
            </div>
          </CardContent>
        </Card>

        <ActiveTrips />
      </AuthGuard>
    </div>
  );
}
