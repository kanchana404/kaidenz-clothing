"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

// Dummy cart data
const DUMMY_CART = [
  {
    id: 1,
    name: "Sentinel Jacket",
    image: "/p1.png",
    price: 49.0,
    quantity: 1,
    details: "Size: L\nColor: Gray",
  },
  {
    id: 2,
    name: "Boa Fleece Jacket",
    image: "/p2.png",
    price: 122.0,
    quantity: 2,
    details: "Size: L\nColor: Black Navy",
  },
];

// Dummy recommended products
const RECOMMENDED = [
  {
    id: 101,
    name: "Urban Windbreaker",
    image: "/p3.png",
    price: 89.0,
    details: "Size: M\nColor: Blue",
  },
  {
    id: 102,
    name: "Classic Hoodie",
    image: "/p4.png",
    price: 59.0,
    details: "Size: XL\nColor: Black",
  },
  {
    id: 103,
    name: "Lightweight Parka",
    image: "/p1.png",
    price: 99.0,
    details: "Size: S\nColor: Olive",
  },
  {
    id: 104,
    name: "Rain Shell Jacket",
    image: "/p2.png",
    price: 109.0,
    details: "Size: L\nColor: Navy",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(DUMMY_CART);

  // Send POST request to /api/cart (which forwards to /CheckSession) on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Cart page loaded - sending POST request to /api/cart");
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}), // Empty POST request as requested
        });

        const data = await response.json();
        console.log("Cart API response:", data);
        
        if (response.ok) {
          if (data.authenticated) {
            console.log("User is authenticated:", data);
            // You can use the user data here
            // data.user_id, data.email, data.first_name, data.last_name, etc.
          } else {
            console.log("User is not authenticated:", data.message);
            // Handle unauthenticated user - maybe redirect to login
          }
        } else {
          console.error("Cart API error:", data);
        }
      } catch (error) {
        console.error("Error calling cart API:", error);
      }
    };

    checkSession();
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wide text-center">Shopping Cart</h1>
          {cart.length > 0 && (
            <p className="text-center text-muted-foreground mt-2 text-sm">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg font-light">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {cart.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-6 py-6">
                      {/* Product Image */}
                      <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={144} 
                          height={144} 
                          className="object-contain w-36 h-36 bg-white rounded-md" 
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          {item.details.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label={`Remove ${item.name} from cart`}
                          title={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="font-medium text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {index < cart.length - 1 && <Separator className="opacity-30" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="border border-border rounded-lg p-6 space-y-4">
                  <h2 className="font-medium text-lg">Summary</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-primary">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <Separator className="opacity-30" />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <Link href="/checkout" className="block w-full mt-6">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium rounded-lg">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-light mb-8 text-center">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECOMMENDED.map((prod) => (
              <div key={prod.id} className="group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-muted flex items-center justify-center p-4">
                    <Image 
                      src={prod.image} 
                      alt={prod.name} 
                      width={160} 
                      height={160} 
                      className="object-contain w-full h-full bg-white rounded-md" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-base mb-2">{prod.name}</h3>
                    <div className="text-sm text-muted-foreground mb-3 space-y-1">
                      {prod.details.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg text-primary">${prod.price.toFixed(2)}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}