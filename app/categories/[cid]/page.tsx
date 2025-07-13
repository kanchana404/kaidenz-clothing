'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/ui/navbar';
import Link from 'next/link';
import Footer from '@/components/ui/footer';

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 19.99,
    image: '/p1.png',
    description: 'Premium cotton, relaxed fit, all-season essential.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    price: 49.99,
    image: '/p2.png',
    description: 'Timeless style, durable denim, perfect for layering.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'out',
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    price: 39.99,
    image: '/p3.png',
    description: 'Lightweight, breezy, and vibrant for sunny days.',
    size: ['S', 'M', 'L'],
    stock: 'available',
  },
  {
    id: 4,
    name: 'Comfy Joggers',
    price: 29.99,
    image: '/p4.png',
    description: 'Soft fabric, tapered fit, ideal for lounging or outings.',
    size: ['M', 'L', 'XL'],
    stock: 'available',
  },
];

// Repeat products to simulate a larger grid
const repeatedProducts = Array(3).fill(products).flat().map((p, i) => ({ ...p, id: i + 1 }));

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const CategoryPage = () => {
  const [price, setPrice] = useState(50);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stock, setStock] = useState<{ available: boolean; out: boolean }>({ available: false, out: false });

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleStockToggle = (type: 'available' | 'out') => {
    setStock((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Filter logic
  const filteredProducts = repeatedProducts.filter((product) => {
    const matchesPrice = product.price <= price;
    const matchesSize =
      selectedSizes.length === 0 || product.size.some((s: string) => selectedSizes.includes(s));
    const matchesStock =
      (!stock.available && !stock.out) ||
      (stock.available && product.stock === 'available') ||
      (stock.out && product.stock === 'out');
    return matchesPrice && matchesSize && matchesStock;
  });

  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <Card className="bg-card border border-border">
              <CardHeader>
                <h2 className="text-xl font-semibold mb-2">Filters</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-8">
                {/* Price Filter */}
                <div>
                  <Label htmlFor="price-range" className="mb-2 block">Price (up to ${price})</Label>
                  <input
                    id="price-range"
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label="Price range"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$10</span>
                    <span>$100</span>
                  </div>
                </div>
                {/* Size Filter */}
                <div>
                  <Label className="mb-2 block">Size</Label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                        className="px-4 py-2 text-sm rounded-md"
                        onClick={() => handleSizeToggle(size)}
                        type="button"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Stock Filter */}
                <div>
                  <Label className="mb-2 block">Stock</Label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stock.available}
                        onChange={() => handleStockToggle('available')}
                        className="accent-primary rounded"
                      />
                      <span>Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stock.out}
                        onChange={() => handleStockToggle('out')}
                        className="accent-primary rounded"
                      />
                      <span>Out of Stock</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-16 text-lg">No products found.</div>
              ) : (
                filteredProducts.map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="group cursor-pointer bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-foreground mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono min-h-[40px] leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-medium text-foreground">${item.price.toFixed(2)}</span>
                        <Button
                          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-0 hover:bg-primary/90 transition-all duration-200"
                          variant="default"
                          aria-label={`Add ${item.name} to cart`}
                          type="button"
                          tabIndex={-1}
                          onClick={e => e.preventDefault()}
                        >
                          +
                          <span className="sr-only">Add to Cart</span>
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;