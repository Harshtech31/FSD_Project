import { Car, Users, Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HowItWorks() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Car className="w-12 h-12 mb-4 text-primary" />
            <CardTitle>Register Your Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            Add your vehicle details - whether it&apos;s a bike or car, and how many seats are available.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="w-12 h-12 mb-4 text-primary" />
            <CardTitle>Find Travel Buddies</CardTitle>
          </CardHeader>
          <CardContent>Connect with students traveling to the same destination and share the ride.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Calculator className="w-12 h-12 mb-4 text-primary" />
            <CardTitle>Split Costs</CardTitle>
          </CardHeader>
          <CardContent>
            Our smart algorithm calculates the most cost-effective route and fair cost splitting.
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

