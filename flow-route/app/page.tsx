import { Button } from "@/components/ui/button"
import { ActiveTrips } from "@/components/active-trips"
import { HowItWorks } from "@/components/how-it-works"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter">FlowRoute – Ride Sharing &amp; Travel Planner</h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Share Rides, Save Costs, Explore More!
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/trips/new">
            <Button size="lg">Create a Trip</Button>
          </Link>
          <Link href="/trips">
            <Button variant="outline" size="lg">
              Find a Ride
            </Button>
          </Link>
        </div>
      </section>
      <section className="text-center py-8 space-y-4">
        <h2 className="text-2xl font-semibold">Get Started</h2>
        <div className="flex justify-center gap-4">
          <Link href="/?auth=signin">
            <Button size="lg">Sign In / Register</Button>
          </Link>
        </div>
      </section>
      <HowItWorks />
      <ActiveTrips />
    </div>
  )
}

