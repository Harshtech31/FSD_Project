"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function AuthDialog() {
  const searchParams = useSearchParams();
  const authType = searchParams.get("auth");
  const router = useRouter();

  return (
    <>
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => router.push("/?auth=signin")}
      >
        {authType === "signin" ? "Sign In" : "Create Account"}
      </Button>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you a new customer?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/?auth=signup")}
              >
                Yes
              </Button>
              
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => router.push("/?auth=signin")}
              >
                No
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
