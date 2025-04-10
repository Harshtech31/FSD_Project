"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LockIcon } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  // Default fallback if none provided
  if (!fallback) {
    fallback = (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50 space-y-4">
        <LockIcon className="w-12 h-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">Authentication Required</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          You need to sign in to access this feature. Please sign in or create an account to continue.
        </p>
      </div>
    )
  }

  return <>{fallback}</>
}
