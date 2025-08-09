"use client";
import React, { useState, useEffect } from "react";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from '@/lib/auth-hook';
import { useCart } from '@/lib/cart-context';
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
  discount?: number;
}

export default function SalePage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch random sale products
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setIsLoading(true);
        const randomProducts = await getRandomProducts(undefined, 8); // Show 8 products for sale page
        
        // Add random discounts to products (20% to 50%)
        const productsWithDiscounts = randomProducts.map((product: Product) => ({
          ...product,
          discount: Math.floor(Math.random() * 31) + 20 // Random discount between 20% and 50%
        }));
        
        setSaleProducts(productsWithDiscounts);
      } catch (error) {
        console.error('Error fetching sale products:', error);
        setSaleProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-50 flex flex-col">
      {/* Hero Section */}
      <div className="w-full py-16 bg-gradient-to-r from-[#ffcb74] via-[#ffb347] to-[#ff7e5f] text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow mb-4 animate-pulse">Big Sale!</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-6 animate-bounce">Up to <span className="font-bold text-4xl">30% OFF</span> on selected items</p>
        <Button className="bg-white text-[#ff7e5f] font-bold px-8 py-3 text-lg rounded-full shadow-lg hover:bg-[#fff3e0] transition-all duration-300 animate-shake">Shop Now</Button>
      </div>
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#ff7e5f]">Sale Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="relative bg-white border border-[#ffcb74] rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="absolute top-4 right-4 bg-[#ff7e5f] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  -25%
                </div>
                <div className="aspect-square bg-[#fff3e0]"></div>
                <div className="p-6 flex flex-col items-center">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))
          ) : saleProducts.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-[#ff7e5f] text-lg">No sale products available at the moment.</p>
            </div>
          ) : (
            saleProducts.map((product) => (
              <div key={product.id} className="relative bg-white border border-[#ffcb74] rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-4 right-4 bg-[#ff7e5f] text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce z-10">
                  -{product.discount || 20}%
                </div>
                <div className="aspect-square bg-[#fff3e0] flex items-center justify-center">
                  <Image src={product.imageUrls[0]} alt={product.name} width={200} height={200} className="object-contain w-full h-full" />
                </div>
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2 text-[#ff7e5f]">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#ff7e5f]">${(product.basePrice * (1 - (product.discount || 20) / 100)).toFixed(2)}</span>
                    <span className="text-base line-through text-gray-400">${product.basePrice.toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-[#ffcb74] text-[#111] font-bold rounded-lg mt-2"
                    onClick={() => handleAddToCart(product.id, product.name)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 