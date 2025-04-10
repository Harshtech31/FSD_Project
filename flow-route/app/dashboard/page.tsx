"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Trips</CardTitle>
            <CardDescription>Trips you've created or joined</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No trips yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Rides</CardTitle>
            <CardDescription>Your scheduled rides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No upcoming rides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Routes</CardTitle>
            <CardDescription>Your frequently used routes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No saved routes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
