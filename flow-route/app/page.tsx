"use client";

import { Button } from "@/components/ui/button";
import { ActiveTrips } from "@/components/active-trips";
import { HowItWorks } from "@/components/how-it-works";
import Link from "next/link";
import { AuthChoiceDialog } from "@/components/auth-choice-dialog";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return (
    <div className="space-y-8">
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter">
          FlowRoute – Ride Sharing &amp; Travel Planner
        </h1>
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
      {!isAuthenticated && (
        <section className="text-center py-8 space-y-4">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <div className="flex justify-center gap-4">
            <AuthChoiceDialog
              onSignInClick={() => {
                // Find the Sign In button in the header using data-testid
                const signInButton = document.querySelector(
                  '[data-testid="signin-button"]'
                );
                if (signInButton instanceof HTMLElement) {
                  signInButton.click();
                }
              }}
              onSignUpClick={() => {
                // Find the Sign Up button in the header using data-testid
                const signUpButton = document.querySelector(
                  '[data-testid="signup-button"]'
                );
                if (signUpButton instanceof HTMLElement) {
                  signUpButton.click();
                }
              }}
            />
          </div>
        </section>
      )}
      {isAuthenticated && (
        <section className="text-center py-8 space-y-4">
          <h2 className="text-2xl font-semibold">Welcome Back!</h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </section>
      )}
      <HowItWorks />
      <ActiveTrips />
    </div>
  );
}
