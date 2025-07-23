"use client"
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-hook';
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
  const { isAuthenticated, addToCart } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("You have to sign in to add products to the cart");
      return;
    }

    // Show loading state and store the toast ID
    const loadingToast = toast.loading("Adding to cart...");
    
    const result = await addToCart(productId, 1, 1); // Default quantity 1, color ID 1
    
    // Dismiss the loading toast
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(`${productName} added to cart!`);
    } else {
      toast.error(result.error || "Failed to add product to cart");
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
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                />
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