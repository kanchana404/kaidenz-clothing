"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-hook';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { toast } from 'sonner';
import { getRandomProducts } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  basePrice: number;
  imageUrls: string[];
  description?: string;
  qty?: number;
  category?: string;
}

const HealthyFoodMenu = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist, getWishlistItemId } = useWishlist();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch random featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const randomProducts = await getRandomProducts(undefined, 4);
        setFeaturedProducts(randomProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to empty array if API fails
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

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
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100"></div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="h-5 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-100 rounded w-16"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                  </div>
                </div>
              </div>
            ))
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No featured products available.</p>
            </div>
          ) : (
            featuredProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group cursor-pointer bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                {/* Image Container */}
                <div className="aspect-square bg-gray-50 overflow-hidden relative">
                  <img 
                    src={item.imageUrls[0]} 
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
                      ${item.basePrice.toFixed(2)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthyFoodMenu;