'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Footer from '@/components/ui/footer';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { useParams } from 'next/navigation';
import ColorDots from '@/components/color-dots';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-hook';
import { toast } from 'sonner';

// CSS for image carousel animations with gaps
const carouselStyles = `
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    20%, 80% { opacity: 1; }
  }
  
  .image-carousel img {
    opacity: 0;
    animation: fadeInOut 4s infinite;
  }
  
  .image-carousel img:nth-child(1) { animation-delay: 0s; }
  .image-carousel img:nth-child(2) { animation-delay: 2s; }
  .image-carousel img:nth-child(3) { animation-delay: 4s; }
  .image-carousel img:nth-child(4) { animation-delay: 6s; }
  .image-carousel img:nth-child(5) { animation-delay: 8s; }
`;

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

const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const CategoryPage = () => {
  const { isAuthenticated, addToCart } = useAuth();
  const params = useParams();
  const categoryName = params.cid as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState(50);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stock, setStock] = useState<{ available: boolean; out: boolean }>({ available: false, out: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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

    // Show loading state and store the toast ID
    const loadingToast = toast.loading("Adding to cart...");
    
    const result = await addToCart(productId, 1, 1);
    
    // Dismiss the loading toast
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(`${productName} added to cart!`);
    } else {
      toast.error(result.error || "Failed to add product to cart");
    }
  };

  // Get available colors from products
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

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products-by-category?categoryName=${encodeURIComponent(categoryName)}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
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

    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  // Filter logic
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

  // Filter UI as a component for reuse
  const FilterCard = (
    <div>
      <Card className="bg-card border border-border w-full lg:w-80">
        <CardHeader>
          <h2 className="text-xl font-semibold mb-2">Filters</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Search Filter */}
          <div>
            <Label htmlFor="search" className="mb-2 block">Search</Label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border rounded-md px-3 py-2 text-base shadow-xs outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
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
          {/* Color Filter */}
          <div>
            <Label className="mb-2 block">Color</Label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color: string) => (
                <Button
                  key={color}
                  variant={selectedColors.includes(color) ? 'default' : 'outline'}
                  className="px-4 py-2 text-sm rounded-md"
                  onClick={() => handleColorToggle(color)}
                  type="button"
                  style={{ backgroundColor: selectedColors.includes(color) ? color.toLowerCase() : undefined, color: selectedColors.includes(color) ? '#fff' : undefined }}
                >
                  {color}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background w-full">
      <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />
      <div className="w-full px-2 sm:px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0 flex flex-col items-stretch min-w-0 lg:min-w-[320px] max-w-full lg:sticky lg:top-24">
            {/* Show filter button on small screens */}
            <div className="block lg:hidden mb-4">
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button className="w-full flex items-center gap-2" variant="outline" onClick={() => setFilterOpen(true)}>
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="max-w-xs w-full p-0 bg-white text-foreground">
                  <div className="p-4 flex flex-col gap-8">
                    {/* Search Filter */}
                    <div>
                      <Label htmlFor="search" className="mb-2 block">Search</Label>
                      <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border rounded-md px-3 py-2 text-base shadow-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
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
                    {/* Color Filter */}
                    <div>
                      <Label className="mb-2 block">Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((color: string) => (
                          <Button
                            key={color}
                            variant={selectedColors.includes(color) ? 'default' : 'outline'}
                            className="px-4 py-2 text-sm rounded-md"
                            onClick={() => handleColorToggle(color)}
                            type="button"
                            style={{ backgroundColor: selectedColors.includes(color) ? color.toLowerCase() : undefined, color: selectedColors.includes(color) ? '#fff' : undefined }}
                          >
                            {color}
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
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* Show sidebar on large screens */}
            <div className="hidden lg:block w-full lg:w-80">{FilterCard}</div>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-4 w-full">
            {/* Category Header */}
            <div className="w-full flex justify-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold text-center capitalize">
                {categoryName.replace('-', ' ')} <span className="text-[#ffcb74]">Collection</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-muted-foreground py-16 text-lg">Loading products...</div>
              ) : error ? (
                <div className="col-span-full text-center text-red-500 py-16 text-lg">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-16 text-lg">No products found.</div>
              ) : (
                filteredProducts.map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className={`group cursor-pointer bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 relative ${item.totalStock === 0 ? 'opacity-60' : ''}`}>
                    {/* Out of Stock Overlay */}
                    {item.totalStock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                          Out of Stock
                        </div>
                      </div>
                    )}
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                      {item.imageUrls && item.imageUrls.length > 1 ? (
                        <>
                          {/* Image count indicator */}
                          <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.imageUrls.length} images
                          </div>
                          {/* Main image */}
                          <Image
                            src={item.imageUrls[0]}
                            alt={item.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-contain p-6 transition-all duration-500 group-hover:opacity-0"
                          />
                          {/* Hover images carousel */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 image-carousel">
                            {item.imageUrls.map((imageUrl: string, index: number) => (
                              <Image
                                key={index}
                                src={imageUrl}
                                alt={`${item.name} - Image ${index + 1}`}
                                width={500}
                                height={500}
                                className="absolute inset-0 w-full h-full object-contain p-6"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <Image
                          src={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/p1.png'}
                          alt={item.name}
                          width={500}
                          height={500}
                          className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-foreground mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono min-h-[40px] leading-relaxed">{item.description}</p>
                        {item.colors && item.colors.length > 0 && (
                          <ColorDots colors={item.colors} className="mt-2" />
                        )}
                        {/* Stock Status */}
                        <div className="mt-2">
                          {item.totalStock === 0 ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              In Stock ({item.totalStock})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-medium text-foreground">${item.basePrice.toFixed(2)}</span>
                        {item.totalStock === 0 ? (
                          <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center p-0 cursor-not-allowed">
                            <span className="text-xs">×</span>
                          </div>
                        ) : (
                          <Button
                            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-0 hover:bg-primary/90 transition-all duration-200"
                            variant="default"
                            aria-label={`Add ${item.name} to cart`}
                            type="button"
                            tabIndex={-1}
                            onClick={(e) => handleAddToCart(e, item.id, item.name)}
                          >
                            +
                            <span className="sr-only">Add to Cart</span>
                          </Button>
                        )}
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