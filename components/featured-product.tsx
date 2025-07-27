"use client"
import React, { useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-hook';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { toast } from 'sonner';

const featuredProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    calories: 0,
    persons: 1,
    price: 19.99,
    image: 'p1.png',
    description: 'Premium cotton, relaxed fit, all-season essential.'
  },
  {
    id: 2,
    name: 'Denim Jacket',
    calories: 0,
    persons: 1,
    price: 49.99,
    image: 'p2.png',
    description: 'Timeless style, durable denim, perfect for layering.'
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    calories: 0,
    persons: 1,
    price: 39.99,
    image: 'p3.png',
    description: 'Lightweight, breezy, and vibrant for sunny days.'
  },
  {
    id: 4,
    name: 'Comfy Joggers',
    calories: 0,
    persons: 1,
    price: 29.99,
    image: 'p4.png',
    description: 'Soft fabric, tapered fit, ideal for lounging or outings.'
  }
];

const HealthyFoodMenu = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist, getWishlistItemId } = useWishlist();

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      const result = await addToCart(productId, 1, 1); // Default quantity 1, color ID 1
      if (result.success) {
        toast.success(`${productName} added to cart!`);
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    try {
      if (isProductInWishlist(productId)) {
        // Remove from wishlist
        const wishlistItemId = getWishlistItemId(productId);
        if (wishlistItemId) {
          const result = await removeFromWishlist(wishlistItemId);
          if (result.success) {
            toast.success(`${productName} removed from wishlist!`);
          } else {
            toast.error(result.error || 'Failed to remove from wishlist');
          }
        }
      } else {
        // Add to wishlist
        const result = await addToWishlist(productId);
        if (result.success) {
          toast.success(`${productName} added to wishlist!`);
        } else {
          toast.error(result.error || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="w-full bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4 leading-tight">
            Featured <span className="text-primary">Products</span>
          </h1>
          <p className="text-base text-muted-foreground font-mono max-w-2xl mx-auto leading-relaxed">
            Elevate your wardrobe with our curated collection of modern essentials for every season and every style.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group cursor-pointer bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              {/* Image Container */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                />
                {/* Wishlist Button */}
                <Button
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center p-0 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md ${
                    isProductInWishlist(item.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                  variant="ghost"
                  aria-label={`${isProductInWishlist(item.id) ? 'Remove' : 'Add'} ${item.name} from wishlist`}
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => handleAddToWishlist(e, item.id, item.name)}
                >
                  <Heart size={16} className={isProductInWishlist(item.id) ? 'fill-current' : ''} />
                  <span className="sr-only">{isProductInWishlist(item.id) ? 'Remove from' : 'Add to'} Wishlist</span>
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono min-h-[40px] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Add Button */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-medium text-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-0 hover:bg-primary/90 transition-all duration-200"
                    variant="default"
                    aria-label={`Add ${item.name} to cart`}
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => handleAddToCart(e, item.id, item.name)}
                  >
                    <Plus size={18} />
                    <span className="sr-only">Add to Cart</span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthyFoodMenu;