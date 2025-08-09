"use client"
import { useState, useEffect } from 'react';
import { Heart, Plus, X, Star, ExternalLink, Share2, ShoppingCart, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth-hook';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { toast } from 'sonner';
import Footer from '@/components/ui/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Product skeleton for loading state
const ProductSkeleton = () => (
  <div className="rounded-3xl border border-neutral-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-neutral-100"></div>
    <div className="p-6">
      <div className="h-4 bg-neutral-100 rounded mb-2"></div>
      <div className="h-3 bg-neutral-100 rounded mb-4"></div>
      <div className="h-3 bg-neutral-100 rounded mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-neutral-100 rounded w-16"></div>
        <div className="w-9 h-9 rounded-full bg-neutral-100"></div>
      </div>
    </div>
  </div>
);

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, isLoading, fetchWishlistData } = useWishlist();
  const router = useRouter();

  // Fetch wishlist data when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('WishlistPage: User is authenticated, fetching wishlist data...');
      fetchWishlistData();
    } else {
      console.log('WishlistPage: User is not authenticated');
    }
  }, [isAuthenticated, fetchWishlistData]);

  // Debug effect to log when wishlist items change
  useEffect(() => {
    console.log('WishlistPage: wishlistItems changed:', wishlistItems);
    console.log('WishlistPage: Current count:', wishlistItems.length);
  }, [wishlistItems]);

  const removeItem = async (id: number) => {
    console.log('WishlistPage: Removing item with ID:', id);
    console.log('WishlistPage: Current wishlist items before removal:', wishlistItems);
    
    const result = await removeFromWishlist(id);
    
    if (result.success) {
      console.log('WishlistPage: Item removed successfully');
      console.log('WishlistPage: Current wishlist items after removal:', wishlistItems);
      toast.success('Item removed from wishlist');
    } else {
      console.error('WishlistPage: Failed to remove item:', result.error);
      toast.error(result.error || 'Failed to remove item');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      const result = await addToCart(productId, 1, 1);
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

  const handleViewProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.product.basePrice, 0);

  // Show authentication required message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#ffcb74]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-[#ffcb74]" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sign in to view your wishlist</h3>
            <p className="text-gray-600 mb-8">Please sign in to access your saved items</p>
            <Link href="/sign-in">
              <Button className="gap-2 bg-[#ffcb74] hover:bg-[#ffcb74]/90 text-white font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#ffcb74]/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#ffcb74]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
              My <span className="text-[#ffcb74]">Wishlist</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Your saved items from the store. A collection of products you're interested in.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button variant="outline" size="sm" className="gap-2 border-[#ffcb74] text-[#ffcb74] hover:bg-[#ffcb74]/10">
              <Share2 className="w-4 h-4" />
              Share List
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => {
                console.log('WishlistPage: Manual refresh button clicked');
                fetchWishlistData();
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{wishlistItems.length} items</span>
              <span>•</span>
              <span>${totalValue.toFixed(2)} total value</span>
            </div>
          </div>
        </header>

       

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-[#ffcb74]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-12 h-12 text-[#ffcb74]" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-8">Start browsing products and add them to your wishlist</p>
                  <Link href="/">
                    <Button className="gap-2 bg-[#ffcb74] hover:bg-[#ffcb74]/90 text-white font-medium">
                      <Plus className="w-4 h-4" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <div key={item.id} className="group rounded-3xl border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-neutral-200 relative">
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 z-30 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                      aria-label={`Remove ${item.product.name} from wishlist`}
                      title={`Remove ${item.product.name} from wishlist`}
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden relative">
                      {item.product.imageUrls && item.product.imageUrls.length > 1 ? (
                        <>
                          {/* Image count indicator */}
                          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.product.imageUrls.length} photos
                          </div>
                          {/* Main image */}
                          <Image
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain p-6 transition-all duration-500 group-hover:opacity-0"
                          />
                          {/* Hover carousel */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 modern-carousel">
                            {item.product.imageUrls.map((imageUrl: string, index: number) => (
                              <Image
                                key={index}
                                src={imageUrl}
                                alt={`${item.product.name} - Image ${index + 1}`}
                                width={400}
                                height={400}
                                className="absolute inset-0 w-full h-full object-contain p-6"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <Image
                          src={item.product.imageUrls?.[0] || '/p1.png'}
                          alt={item.product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="font-medium text-neutral-900 mb-2 text-lg leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                          {item.product.description || 'Product description not available'}
                        </p>
                        
                        {/* Stock Status */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                            In Wishlist
                          </Badge>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-neutral-900">
                          ${item.product.basePrice.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="w-9 h-9 rounded-full border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewProduct(item.product.id);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200"
                            onClick={(e) => handleAddToCart(e, item.product.id, item.product.name)}
                          >
                            <span className="text-lg font-light">+</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 pt-8 border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Built with care • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
      <Footer />
    </div>
  );
}