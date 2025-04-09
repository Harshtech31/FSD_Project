import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">
          Create an account to get started
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Input placeholder="name@example.com" type="email" />
        </div>
        <Button className="w-full">Create Account</Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
