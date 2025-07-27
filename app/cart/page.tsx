"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from '@/lib/auth-hook';
import { useCart } from '@/lib/cart-context';

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
  const { isAuthenticated } = useAuth();
  const { cartItems, cartTotalPrice, isLoading, isUpdating, updateCartItem, removeFromCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Check authentication only - cart data is fetched by the context on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please sign in to view your cart');
    } else {
      setError(null);
    }
  }, [isAuthenticated]);

  const updateQuantity = async (id: number, delta: number) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (!currentItem) return;

    const newQuantity = currentItem.qty + delta;
    if (newQuantity <= 0) {
      // If quantity would be 0 or negative, remove the item
      await removeItem(id);
      return;
    }

    // Add item to updating set
    setUpdatingItems(prev => new Set(prev).add(id));

    try {
      const result = await updateCartItem(id, newQuantity);
      if (!result.success) {
        console.error('Failed to update quantity:', result.error);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      // Remove item from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const removeItem = async (id: number) => {
    // Add item to updating set
    setUpdatingItems(prev => new Set(prev).add(id));

    try {
      const result = await removeFromCart(id);
      if (!result.success) {
        console.error('Failed to remove item:', result.error);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      // Remove item from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wide text-center">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <p className="text-center text-muted-foreground mt-2 text-sm">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg font-light">Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg font-light mb-6">{error}</p>
            {!isAuthenticated && (
              <div className="space-x-4">
                <Link href="/sign-in">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg font-light">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {cartItems.map((item, index) => {
                  const isItemUpdating = updatingItems.has(item.id);
                  return (
                    <div key={item.id} className={`transition-opacity duration-200 ${isItemUpdating ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="flex gap-6 py-6">
                        {/* Product Image */}
                        <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <Image 
                            src={item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDE0NCAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDQiIGhlaWdodD0iMTQ0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03MiAzNkM2MS45NTQzIDM2IDU0IDQzLjk1NDMgNTQgNTRDNTQgNjQuMDQ1NyA2MS45NTQzIDcyIDcyQzgxLjA0NTcgNzIgODkgNjQuMDQ1NyA4OSA1NEM4OSA0My45NTQzIDgxLjA0NTcgMzYgNzIgMzZaIiBmaWxsPSIjOTRBM0E2Ii8+CjxwYXRoIGQ9Ik0zNiAxMDhDMzYgOTcuOTU0MyA0My45NTQzIDkwIDU0IDkwSDkwQzEwMC4wNDYgOTAgMTA4IDk3Ljk1NDMgMTA4IDEwOFYxMjBIMzZWMTA4WiIgZmlsbD0iIzk0QTNBNiIvPgo8L3N2Zz4K'}
                            alt={item.product.name} 
                            width={144} 
                            height={144} 
                            className="object-contain w-36 h-36 bg-white rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-lg">{item.product.name}</h3>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <div>Color: {item.color.name}</div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={isItemUpdating}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {isItemUpdating ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                              ) : (
                                item.qty
                              )}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40"
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={isItemUpdating}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <p className="text-lg font-semibold">${(item.product.basePrice * item.qty).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">${item.product.basePrice.toFixed(2)} each</p>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40"
                            onClick={() => removeItem(item.id)}
                            disabled={isItemUpdating}
                          >
                            {isItemUpdating ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  );
                })}
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
                      <span className={isUpdating ? 'opacity-50' : ''}>
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary inline-block"></div>
                        ) : (
                          `$${cartTotalPrice.toFixed(2)}`
                        )}
                      </span>
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
                    <span className={isUpdating ? 'opacity-50' : ''}>
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary inline-block"></div>
                      ) : (
                        `$${cartTotalPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <Link href="/checkout" className="block w-full mt-6">
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium rounded-lg"
                      disabled={isUpdating || cartItems.length === 0}
                    >
                      {isUpdating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </div>
                      ) : (
                        'Checkout'
                      )}
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