'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/ui/footer'
import ColorDots from '@/components/color-dots'

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

// Rename 'page' to 'HeroSection'
const HeroSection = () => {
  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 z-10"></div>
        <Image
          src="/new-arivals-page.png"
          alt="New Arrivals"
          width={900}
          height={900}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
        />

      </div>

      <div className="w-1/2 flex flex-col justify-center items-center px-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>

        {/* Main content */}
        <div className="text-center space-y-8 z-10">
          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-tight">
            New <span className="text-[#ffcb74] font-semibold">Arrivals</span>
          </h1>

          {/* Subtitle */}
          <div className="flex justify-center items-center">
            <p className="text-xl text-muted-foreground font-mono mb-8 max-w-md leading-relaxed">
              Discover our latest arrivals and stay ahead of the curve with our <br />
              <span className="text-primary font-semibold"> exclusive collection</span>.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex gap-8 justify-center mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground font-medium">New Styles</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">24H</div>
              <div className="text-sm text-muted-foreground font-medium">Fast Shipping</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground font-medium">Authentic</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Shop Now
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 rounded-full font-semibold transition-all duration-300">
              View Catalog
            </Button>
          </div>

          {/* Social proof */}
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex items-center justify-center gap-3 mt-6">

                <span className="text-sm text-muted-foreground ml-2">
                  <span className="font-semibold text-foreground">2,847</span> customers love our new arrivals
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Products will be loaded from API
const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Product interface for API data
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
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [price, setPrice] = React.useState(50);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const [stock, setStock] = React.useState<{ available: boolean; out: boolean }>({ available: false, out: false });
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  // Pagination state
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

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

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
    <div className="w-full px-2 sm:px-4 py-12">
      <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />
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
          <div className="w-full flex justify-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-center">The best <span className="text-[#ffcb74]">products</span> are here.</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground py-16 text-lg">Loading products...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-16 text-lg">{error}</div>
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-16 text-lg">No products found.</div>
            ) : (
              paginatedProducts.map((item) => (
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
                          onClick={e => e.preventDefault()}
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
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  className="px-3"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="px-3"
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
  );
};

export default function PageWithProducts() {
  return (
    <div className="min-h-screen bg-background w-full">
      <HeroSection />
      <ProductList />
      <Footer />
    </div>
  );
}