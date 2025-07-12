import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="w-full bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Featured <span className="text-primary">Products</span>
          </h1>
          <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto leading-relaxed">
            Elevate your wardrobe with our curated collection of modern essentials for every season and every style. Shop the latest trends in comfort and fashion.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((item) => (
            <div key={item.id} className="group cursor-pointer bg-card text-card-foreground rounded-3xl p-6 mb-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl flex flex-col justify-between">
              {/* Image Container */}
              <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono mb-2 min-h-[40px]">{item.description}</p>
              </div>

              {/* Price and Add Button */}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                <Button
                  className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-0 hover:bg-primary/90"
                  variant="default"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <Plus size={20} />
                  <span className="sr-only">Add to Cart</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthyFoodMenu;