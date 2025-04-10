"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AuthChoiceDialogProps {
  onSignInClick: () => void
  onSignUpClick: () => void
}

export function AuthChoiceDialog({ onSignInClick, onSignUpClick }: AuthChoiceDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSignIn = () => {
    setOpen(false)
    onSignInClick()
  }

  const handleSignUp = () => {
    setOpen(false)
    onSignUpClick()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Sign In / Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose an Option</DialogTitle>
          <DialogDescription>
            Sign in to your existing account or create a new one
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-4">
          <Button 
            className="flex-1" 
            variant="outline" 
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleSignUp}
          >
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
