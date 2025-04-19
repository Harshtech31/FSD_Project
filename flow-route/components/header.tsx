"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, login, register } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Sign In values:", values);
    // Use the login function from auth context
    login(values.email, values.password);
    // Close the dialog
    document.body.click(); // This will close the dialog by clicking outside of it
  };

  const onSignUpSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Sign Up values:", values);
    // Generate a default name from the email
    const name = values.email.split("@")[0];
    // Use the register function from auth context
    register(name, values.email, values.password);
    // Close the dialog
    document.body.click(); // This will close the dialog by clicking outside of it
    // Find and click the Sign In button to open the Sign In dialog
    setTimeout(() => {
      const signInButton = document.querySelector(
        '[data-testid="signin-button"]'
      );
      if (signInButton instanceof HTMLElement) {
        signInButton.click();
      }
    }, 100); // Small delay to ensure the first dialog is fully closed
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          FlowRoute
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/trips"
            className={
              pathname === "/trips"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }
          >
            Find Trips
          </Link>
          <Link
            href="/route-planner"
            className={
              pathname === "/route-planner"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }
          >
            Route Planner
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className={
                  pathname === "/dashboard"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Dashboard</DialogTitle>
                <DialogDescription>
                  Quick access to your account details and recent activity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Recent Trips</h4>
                  <p className="text-sm text-muted-foreground">
                    No recent trips
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">View Full Dashboard</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <ModeToggle />

          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" data-testid="signup-button">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create an Account</DialogTitle>
                    <DialogDescription>
                      Sign up to start sharing rides and planning trips
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSignUpSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="student@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="signin-button">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access your account
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSignInSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="student@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Sign In
                      </Button>
                      <div className="text-center text-sm pt-2">
                        <Link
                          href="/forgot-password"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
