'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Filter, Search, Star } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/ui/footer'
import ColorDots from '@/components/color-dots'
import { useAuth } from '@/lib/auth-hook';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Modern CSS for image carousel animations
const carouselStyles = `
  @keyframes smoothFade {
    0%, 100% { opacity: 0; transform: scale(1.02); }
    25%, 75% { opacity: 1; transform: scale(1.05); }
  }
  
  .modern-carousel img {
    opacity: 0;
    animation: smoothFade 5s infinite ease-in-out;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .modern-carousel img:nth-child(1) { animation-delay: 0s; }
  .modern-carousel img:nth-child(2) { animation-delay: 1.5s; }
  .modern-carousel img:nth-child(3) { animation-delay: 3s; }
  .modern-carousel img:nth-child(4) { animation-delay: 4.5s; }
  .modern-carousel img:nth-child(5) { animation-delay: 6s; }
`;

// Modern Product Loading Skeleton
const ProductSkeleton = () => (
  <div className="group rounded-3xl border border-neutral-100 overflow-hidden transition-all duration-300">
    <div className="aspect-square overflow-hidden relative">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-6 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1 mt-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full mt-3" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

// Modern Hero Section
const HeroSection = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* Image Section */}
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 z-10"></div>
        <Image
          src="/new-arivals-page.png"
          alt="New Arrivals"
          width={900}
          height={900}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content Section */}
      <div className="w-1/2 flex flex-col justify-center items-center px-16 relative">
        {/* Subtle background elements */}
        <div className="absolute top-32 right-32 w-40 h-40 bg-neutral-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-32 left-32 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-60"></div>

        {/* Main content */}
        <div className="text-center space-y-12 z-10 max-w-lg">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extralight text-neutral-900 leading-none tracking-tight">
              New <span className="text-amber-400 font-light">Arrivals</span>
            </h1>
            <div className="w-24 h-px bg-neutral-200 mx-auto"></div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-neutral-600 leading-relaxed font-light">
            Discover our latest collection of carefully curated pieces that blend timeless elegance with contemporary style.
          </p>

          {/* Feature highlights */}
          <div className="flex gap-12 justify-center py-8">
            <div className="text-center space-y-1">
              <div className="text-3xl font-light text-neutral-900">50+</div>
              <div className="text-sm text-neutral-500 font-medium">New Styles</div>
            </div>
            <Separator orientation="vertical" className="h-16 bg-neutral-200" />
            <div className="text-center space-y-1">
              <div className="text-3xl font-light text-neutral-900">24H</div>
              <div className="text-sm text-neutral-500 font-medium">Fast Shipping</div>
            </div>
            <Separator orientation="vertical" className="h-16 bg-neutral-200" />
            <div className="text-center space-y-1">
              <div className="text-3xl font-light text-neutral-900">100%</div>
              <div className="text-sm text-neutral-500 font-medium">Authentic</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-10 py-6 rounded-full font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Collection
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-6 rounded-full font-medium border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all duration-300"
            >
              View Catalog
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-neutral-500 ml-2">
                <span className="font-medium text-neutral-700">2,847</span> customers love our new arrivals
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Product interface
interface Product {
  id: number;
  name: string;
  basePrice: number;
  description: string;
  imageUrls: string[];
  sizes: Array<{
    sizeId: number;
    sizeName: string;
    stockQuantity: number;
    price: number;
  }>;
  colors: Array<{
    colorId: number;
    colorName: string;
  }>;
  totalStock: number;
  categoryId: number;
  categoryName: string;
}

const ProductList = () => {
  const { isAuthenticated, addToCart } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [price, setPrice] = React.useState(50);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const [stock, setStock] = React.useState<{ available: boolean; out: boolean }>({ available: false, out: false });
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 12;

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleStockToggle = (type: 'available' | 'out') => {
    setStock((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("You have to sign in to add products to the cart");
      return;
    }

    const loadingToast = toast.loading("Adding to cart...");
    const result = await addToCart(productId, 1, 1);
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(`${productName} added to cart!`);
    } else {
      toast.error(result.error || "Failed to add product to cart");
    }
  };

  const getAvailableColors = () => {
    const colorSet = new Set<string>();
    products.forEach(product => {
      if (product.colors) {
        product.colors.forEach(color => {
          colorSet.add(color.colorName);
        });
      }
    });
    return Array.from(colorSet).sort();
  };

  const availableColors = getAvailableColors();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/get-products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.basePrice <= price;
    const matchesSize =
      selectedSizes.length === 0 || product.sizes.some((s) => selectedSizes.includes(s.sizeName));
    const matchesStock =
      (!stock.available && !stock.out) ||
      (stock.available && product.totalStock > 0) ||
      (stock.out && product.totalStock === 0);
    const matchesSearch =
      search.trim() === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesColor =
      selectedColors.length === 0 || (product.colors && product.colors.some(color => selectedColors.includes(color.colorName)));
    return matchesPrice && matchesSize && matchesStock && matchesSearch && matchesColor;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const FilterCard = (
    <Card className="border-neutral-100 shadow-none">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-neutral-900">Filters</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-700">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 border-neutral-200 focus:border-neutral-300 focus:ring-neutral-200"
            />
          </div>
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-700">Price (up to ${price})</Label>
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>$10</span>
            <span>$100</span>
          </div>
        </div>

        {/* Size Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-700">Size</Label>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => (
              <Button
                key={size}
                variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                size="sm"
                className={`h-8 px-3 text-xs font-medium rounded-full border-neutral-200 ${
                  selectedSizes.includes(size) 
                    ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800' 
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-700">Color</Label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color: string) => (
              <Button
                key={color}
                variant={selectedColors.includes(color) ? 'default' : 'outline'}
                size="sm"
                className={`h-8 px-3 text-xs font-medium rounded-full border-neutral-200 ${
                  selectedColors.includes(color) 
                    ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800' 
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => handleColorToggle(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-700">Stock</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stock.available}
                onChange={() => handleStockToggle('available')}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-200"
              />
              <span className="text-sm text-neutral-600">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stock.out}
                onChange={() => handleStockToggle('out')}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-200"
              />
              <span className="text-sm text-neutral-600">Out of Stock</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full px-4 sm:px-6 py-16">
      <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-6">
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-6">
                  {FilterCard}
                </SheetContent>
              </Sheet>
            </div>
            {/* Desktop filter card */}
            <div className="hidden lg:block sticky top-6">
              {FilterCard}
            </div>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-light text-neutral-900 tracking-tight">
                The best <span className="font-medium text-amber-400">products</span> are here.
              </h1>
              <p className="text-neutral-600 mt-4 text-lg">
                Handpicked items that define quality and style
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-20 text-lg">{error}</div>
              ) : paginatedProducts.length === 0 ? (
                <div className="col-span-full text-center text-neutral-500 py-20 text-lg">
                  No products found matching your criteria.
                </div>
              ) : (
                paginatedProducts.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/product/${item.id}`} 
                    className={`group rounded-3xl border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-neutral-200 relative ${
                      item.totalStock === 0 ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Out of Stock Overlay */}
                    {item.totalStock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Badge variant="destructive" className="text-sm font-medium">
                          Out of Stock
                        </Badge>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden relative">
                      {item.imageUrls && item.imageUrls.length > 1 ? (
                        <>
                          {/* Image count indicator */}
                          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.imageUrls.length} photos
                          </div>
                          {/* Main image */}
                          <Image
                            src={item.imageUrls[0]}
                            alt={item.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain p-6 transition-all duration-500 group-hover:opacity-0"
                          />
                          {/* Hover carousel */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 modern-carousel">
                            {item.imageUrls.map((imageUrl: string, index: number) => (
                              <Image
                                key={index}
                                src={imageUrl}
                                alt={`${item.name} - Image ${index + 1}`}
                                width={400}
                                height={400}
                                className="absolute inset-0 w-full h-full object-contain p-6"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <Image
                          src={item.imageUrls?.[0] || '/p1.png'}
                          alt={item.name}
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
                          {item.name}
                        </h3>
                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        
                        {/* Colors */}
                        {item.colors && item.colors.length > 0 && (
                          <ColorDots colors={item.colors} className="mt-3" />
                        )}
                        
                        {/* Stock Status */}
                        <div className="mt-3">
                          {item.totalStock === 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              Out of Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              In Stock ({item.totalStock})
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Price and Add to Cart */}
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-neutral-900">
                          ${item.basePrice.toFixed(2)}
                        </span>
                        {item.totalStock === 0 ? (
                          <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center cursor-not-allowed">
                            <span className="text-sm">×</span>
                          </div>
                        ) : (
                          <Button
                            size="icon"
                            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200"
                            onClick={(e) => handleAddToCart(e, item.id, item.name)}
                          >
                            <span className="text-lg font-light">+</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    className={
                      currentPage === i + 1
                        ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default function PageWithProducts() {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <ProductList />
      <Footer />
    </div>
  );
}