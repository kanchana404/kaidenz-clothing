"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const { fetchCartData } = useCart()
  const { fetchWishlistData } = useWishlist()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const first_name = formData.get("firstName") as string
    const last_name = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      const user = {
        first_name,
        last_name,
        email,
        password,
      };
      const userJson = JSON.stringify(user);
      console.log("User JSON:", userJson);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userJson,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          // Store user data in sessionStorage for email verification page
          sessionStorage.setItem('signupUser', JSON.stringify({
            ...user,
            user_id: data.user_id || ''
          }))
          
          // Initialize cart and wishlist data for the new user
          try {
            console.log("Initializing cart and wishlist for new user...");
            await Promise.all([
              fetchCartData(),
              fetchWishlistData()
            ]);
            console.log("Cart and wishlist initialized successfully");
          } catch (error) {
            console.error("Error initializing cart/wishlist:", error);
            // Don't fail the signup if cart/wishlist initialization fails
          }
          
          toast.success("Signup successful! Please verify your email.");
          window.location.href = "/email-verification";
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Signup failed")
      } else {
        toast.error("Signup failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" type="text" placeholder="John" required />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" type="text" placeholder="Doe" required />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 