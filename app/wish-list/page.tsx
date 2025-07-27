"use client"
import { useState, useEffect } from 'react';
import { Heart, Plus, X, Star, ExternalLink, Share2, ShoppingCart, Eye } from 'lucide-react';
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

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, isLoading, fetchWishlistData } = useWishlist();

  // Fetch wishlist data when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('WishlistPage: User is authenticated, fetching wishlist data...');
      fetchWishlistData();
    } else {
      console.log('WishlistPage: User is not authenticated');
    }
  }, [isAuthenticated, fetchWishlistData]);

  const removeItem = async (id: number) => {
    const result = await removeFromWishlist(id);
    if (result.success) {
      toast.success('Item removed from wishlist');
    } else {
      toast.error(result.error || 'Failed to remove item');
    }
  };

  const handleAddToCart = async (productId: number, productName: string) => {
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
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{wishlistItems.length} items</span>
              <span>•</span>
              <span>${totalValue.toFixed(2)} total value</span>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffcb74] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-light">Loading your wishlist...</p>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group border border-gray-200 bg-white hover:border-[#ffcb74]/30 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0] : '/p1.png'}
                        alt={item.product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                        aria-label={`Remove ${item.product.name} from wishlist`}
                        title={`Remove ${item.product.name} from wishlist`}
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 leading-tight">{item.product.name}</h3>
                        <span className="text-lg font-semibold text-[#ffcb74] ml-2">${item.product.basePrice.toFixed(2)}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">KAIDENZ Store</p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-[#ffcb74] text-[#ffcb74] hover:bg-[#ffcb74]/10"
                          onClick={() => handleAddToCart(item.product.id, item.product.name)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {wishlistItems.length === 0 && (
              <div className="text-center py-16">
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
            )}
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