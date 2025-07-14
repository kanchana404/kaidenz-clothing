'use client'

import Image from 'next/image'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/ui/footer'

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
            New <span className="text-[#ffcb74] font-bold">Arrivals</span>
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

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 19.99,
    image: '/p1.png',
    description: 'Premium cotton, relaxed fit, all-season essential.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'White',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    price: 49.99,
    image: '/p2.png',
    description: 'Timeless style, durable denim, perfect for layering.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'out',
    color: 'Blue',
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    price: 39.99,
    image: '/p3.png',
    description: 'Lightweight, breezy, and vibrant for sunny days.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Yellow',
  },
  {
    id: 4,
    name: 'Comfy Joggers',
    price: 29.99,
    image: '/p4.png',
    description: 'Soft fabric, tapered fit, ideal for lounging or outings.',
    size: ['M', 'L', 'XL'],
    stock: 'available',
    color: 'Gray',
  },
  // Repeat and slightly vary for 24 products
  {
    id: 5,
    name: 'Striped Polo Shirt',
    price: 24.99,
    image: '/p1.png',
    description: 'Casual stripes, breathable fabric, summer favorite.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Navy',
  },
  {
    id: 6,
    name: 'Leather Biker Jacket',
    price: 89.99,
    image: '/p2.png',
    description: 'Edgy look, premium leather, classic fit.',
    size: ['M', 'L', 'XL'],
    stock: 'out',
    color: 'Black',
  },
  {
    id: 7,
    name: 'Boho Maxi Dress',
    price: 59.99,
    image: '/p3.png',
    description: 'Flowy, floral, and perfect for festivals.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'Red',
  },
  {
    id: 8,
    name: 'Slim Fit Chinos',
    price: 34.99,
    image: '/p4.png',
    description: 'Versatile, modern fit, all-day comfort.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'available',
    color: 'Beige',
  },
  {
    id: 9,
    name: 'Graphic Tee',
    price: 21.99,
    image: '/p1.png',
    description: 'Trendy prints, soft cotton, everyday wear.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'White',
  },
  {
    id: 10,
    name: 'Oversized Hoodie',
    price: 44.99,
    image: '/p2.png',
    description: 'Cozy, oversized, and perfect for layering.',
    size: ['M', 'L', 'XL'],
    stock: 'out',
    color: 'Gray',
  },
  {
    id: 11,
    name: 'Pleated Skirt',
    price: 32.99,
    image: '/p3.png',
    description: 'Elegant pleats, midi length, chic style.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Yellow',
  },
  {
    id: 12,
    name: 'Cargo Pants',
    price: 36.99,
    image: '/p4.png',
    description: 'Utility pockets, relaxed fit, durable.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'available',
    color: 'Blue',
  },
  {
    id: 13,
    name: 'V-Neck Sweater',
    price: 27.99,
    image: '/p1.png',
    description: 'Soft knit, classic v-neck, layering essential.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'White',
  },
  {
    id: 14,
    name: 'Bomber Jacket',
    price: 54.99,
    image: '/p2.png',
    description: 'Trendy bomber, ribbed cuffs, lightweight.',
    size: ['M', 'L', 'XL'],
    stock: 'out',
    color: 'Black',
  },
  {
    id: 15,
    name: 'Wrap Dress',
    price: 42.99,
    image: '/p3.png',
    description: 'Flattering wrap, soft fabric, day-to-night.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Red',
  },
  {
    id: 16,
    name: 'Track Pants',
    price: 28.99,
    image: '/p4.png',
    description: 'Sporty, comfortable, and stylish.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'available',
    color: 'Beige',
  },
  {
    id: 17,
    name: 'Henley Shirt',
    price: 23.99,
    image: '/p1.png',
    description: 'Buttoned collar, casual style, soft cotton.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'White',
  },
  {
    id: 18,
    name: 'Puffer Jacket',
    price: 69.99,
    image: '/p2.png',
    description: 'Warm, lightweight, and water-resistant.',
    size: ['M', 'L', 'XL'],
    stock: 'out',
    color: 'Gray',
  },
  {
    id: 19,
    name: 'A-Line Dress',
    price: 38.99,
    image: '/p3.png',
    description: 'Classic A-line, flattering fit, versatile.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Yellow',
  },
  {
    id: 20,
    name: 'Jogger Shorts',
    price: 22.99,
    image: '/p4.png',
    description: 'Casual shorts, drawstring waist, comfy.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'available',
    color: 'Blue',
  },
  {
    id: 21,
    name: 'Crewneck Sweatshirt',
    price: 26.99,
    image: '/p1.png',
    description: 'Classic crewneck, soft fleece, everyday wear.',
    size: ['S', 'M', 'L', 'XL'],
    stock: 'available',
    color: 'White',
  },
  {
    id: 22,
    name: 'Trench Coat',
    price: 79.99,
    image: '/p2.png',
    description: 'Timeless trench, belted waist, water-repellent.',
    size: ['M', 'L', 'XL'],
    stock: 'out',
    color: 'Black',
  },
  {
    id: 23,
    name: 'Tiered Midi Dress',
    price: 49.99,
    image: '/p3.png',
    description: 'Tiered layers, midi length, feminine style.',
    size: ['S', 'M', 'L'],
    stock: 'available',
    color: 'Red',
  },
  {
    id: 24,
    name: 'Utility Pants',
    price: 33.99,
    image: '/p4.png',
    description: 'Functional pockets, modern fit, durable.',
    size: ['M', 'L', 'XL', 'XXL'],
    stock: 'available',
    color: 'Beige',
  },
];

const repeatedProducts = products; // Now 24 unique products
const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const allColors = [
  'White', 'Blue', 'Yellow', 'Gray', 'Navy', 'Black', 'Red', 'Beige',
  // add all unique colors used in products
];

const ProductList = () => {
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

  // Filter logic
  const filteredProducts = repeatedProducts.filter((product) => {
    const matchesPrice = product.price <= price;
    const matchesSize =
      selectedSizes.length === 0 || product.size.some((s: string) => selectedSizes.includes(s));
    const matchesStock =
      (!stock.available && !stock.out) ||
      (stock.available && product.stock === 'available') ||
      (stock.out && product.stock === 'out');
    const matchesSearch =
      search.trim() === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesColor =
      selectedColors.length === 0 || selectedColors.includes(product.color);
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
            {allColors.map((color) => (
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
  );

  return (
    <div className="w-full px-2 sm:px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-1 mb-8 lg:mb-0 flex flex-col items-stretch min-w-0 lg:min-w-[320px] max-w-full">
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
                      {allColors.map((color) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-16 text-lg">No products found.</div>
            ) : (
              paginatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="group cursor-pointer bg-card text-card-foreground rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono min-h-[40px] leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs">Color:</span>
                        <span className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: item.color.toLowerCase() }} title={item.color}></span>
                        <span className="text-xs text-muted-foreground">{item.color}</span>
                      </div>
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