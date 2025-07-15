"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Lock, Star, HelpCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/ui/footer';

// Dummy product data for testing
type ProductKey = 'sentinel' | 'boa' | 'urban' | 'hoodie' | 'parka';

const PRODUCTS = [
  {
    id: 1,
    name: 'Sentinel Jacket',
    image: '/p1.png',
    price: 49.0,
    details: 'Size: L\nColor: Gray',
    key: 'sentinel',
  },
  {
    id: 2,
    name: 'Boa Fleece Jacket',
    image: '/p2.png',
    price: 122.0,
    details: 'Size: L\nColor: Black Navy',
    key: 'boa',
  },
  {
    id: 3,
    name: 'Urban Windbreaker',
    image: '/p3.png',
    price: 89.0,
    details: 'Size: M\nColor: Blue',
    key: 'urban',
  },
  {
    id: 4,
    name: 'Classic Hoodie',
    image: '/p4.png',
    price: 59.0,
    details: 'Size: XL\nColor: Black',
    key: 'hoodie',
  },
  {
    id: 5,
    name: 'Lightweight Parka',
    image: '/p1.png',
    price: 99.0,
    details: 'Size: S\nColor: Olive',
    key: 'parka',
  },
];

const PRODUCTS_PER_PAGE = 2;

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    province: '',
    city: '',
    postalCode: ''
  });

  const [quantities, setQuantities] = useState<Record<ProductKey, number>>({
    sentinel: 1,
    boa: 1,
    urban: 1,
    hoodie: 1,
    parka: 1,
  });
  const [page, setPage] = useState(1);
  const [promo, setPromo] = useState('');
  const [note, setNote] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const updateQuantity = (item: ProductKey, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [item]: Math.max(1, prev[item] + delta)
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(PRODUCTS.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = PRODUCTS.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );
  // Add blank placeholders if less than PRODUCTS_PER_PAGE
  const placeholders = Array(PRODUCTS_PER_PAGE - paginatedProducts.length).fill(null);

  // For demo, assume a $10 discount if promo code is 'SAVE10'
  const discount = promo.trim().toUpperCase() === 'SAVE10' ? 10 : 0;
  const subtotal = PRODUCTS.reduce(
    (sum, product) => sum + product.price * (quantities[product.key as ProductKey] || 1),
    0
  );
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="min-h-screen bg-background text-foreground w-full flex flex-col">
      {/* Progress Indicator */}
      <div className="w-full bg-card border-b border-border py-2 sm:py-3 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4 px-4 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            <span className="rounded-full bg-primary text-primary-foreground w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs sm:text-sm">1</span>
            <span className="font-medium text-xs sm:text-sm md:text-base">Shipping</span>
          </div>
          <span className="w-4 sm:w-8 h-0.5 bg-border rounded flex-shrink-0" />
          <div className="flex items-center gap-1 sm:gap-2 opacity-60 whitespace-nowrap">
            <span className="rounded-full border border-border w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs sm:text-sm">2</span>
            <span className="font-medium text-xs sm:text-sm md:text-base">Payment</span>
          </div>
          <span className="w-4 sm:w-8 h-0.5 bg-border rounded flex-shrink-0" />
          <div className="flex items-center gap-1 sm:gap-2 opacity-60 whitespace-nowrap">
            <span className="rounded-full border border-border w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs sm:text-sm">3</span>
            <span className="font-medium text-xs sm:text-sm md:text-base">Review</span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium px-2">
        <span className="inline-block">New Season Coming! Discount 10% for all product! Check out now! - 30.4R</span>
      </div>
      
      {/* Main Content */}
      <main className="w-full max-w-none mx-auto flex-1 flex flex-col justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* User Greeting and Help */}
        <div className="flex justify-end mb-2 sm:mb-4">
          <a href="#" className="flex items-center gap-1 text-primary hover:underline text-xs sm:text-sm font-medium">
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Need help?
          </a>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-16 w-full flex-1 justify-center items-stretch">
          {/* Left Side - Shipping Information */}
          <section className="w-full xl:w-1/2 bg-card rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md p-3 sm:p-4 md:p-6 lg:p-8 mb-4 xl:mb-0 flex flex-col justify-start">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 tracking-tight text-center"><span className="text-primary">Shipping</span> Information</h2>
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="rounded-lg text-sm sm:text-base py-2 sm:py-3"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="rounded-lg text-sm sm:text-base py-2 sm:py-3"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Mail className="absolute left-3 top-8 sm:top-9 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="rounded-lg text-sm sm:text-base py-2 sm:py-3 pl-8 sm:pl-9"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                  <Phone className="absolute left-3 top-8 sm:top-9 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="rounded-lg text-sm sm:text-base py-2 sm:py-3 pl-8 sm:pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm sm:text-base">Detail Address</Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleTextAreaChange}
                  placeholder="Enter your detail address"
                  className="rounded-lg text-sm sm:text-base py-2 sm:py-3 px-3 w-full min-h-[60px] sm:min-h-[80px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              
              {/* Country and Province row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm sm:text-base">Country</Label>
                  <Select onValueChange={(value) => handleSelectChange('country', value)}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm sm:text-base">Province</Label>
                  <Select onValueChange={(value) => handleSelectChange('province', value)}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3" title="Enter your province/state">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* City and Postal Code row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm sm:text-base">City</Label>
                  <Select onValueChange={(value) => handleSelectChange('city', value)}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="la">Los Angeles</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm sm:text-base">Postal Code</Label>
                  <Select onValueChange={(value) => handleSelectChange('postalCode', value)}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3" title="Enter your postal code">
                      <SelectValue placeholder="Postal code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90210">90210</SelectItem>
                      <SelectItem value="10001">10001</SelectItem>
                      <SelectItem value="60601">60601</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Note/Instructions Field */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm sm:text-base">Order Note / Delivery Instructions</Label>
                <Input
                  id="note"
                  name="note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note for delivery (optional)"
                  className="rounded-lg text-sm sm:text-base py-2 sm:py-3"
                />
              </div>
            </form>
          </section>
          
          {/* Right Side - Order Summary */}
          <section className="w-full xl:w-1/2 max-w-full bg-card rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 bg-[#fafbfc] border border-[#ececec]">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6 tracking-tight">Your Order</h2>
            <Card className="bg-card border border-border rounded-xl shadow-md">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-6 sm:space-y-8">
                  {/* Paginated Products */}
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-h-[140px] sm:min-h-[180px]">
                      <div className="w-full sm:w-36 md:w-40 lg:w-44 h-36 sm:h-36 md:h-40 lg:h-44 bg-muted rounded-xl flex items-center justify-center overflow-hidden shadow-md mx-auto sm:mx-0 flex-shrink-0">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          width={176} 
                          height={176} 
                          className="object-cover w-32 sm:w-32 md:w-36 lg:w-40 h-32 sm:h-32 md:h-36 lg:h-40 rounded-lg" 
                        />
                      </div>
                      <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="text-xs text-muted-foreground">Jolt / Jackets</div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-yellow-500 text-xs font-semibold">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400" /> 4.8
                            </span>
                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-semibold">Best Seller</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground mb-1">{product.name}</h3>
                        <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 whitespace-pre-line">{product.details}</div>
                        <div className="flex items-center justify-between sm:justify-start">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border transition-shadow hover:shadow-md"
                              onClick={() => updateQuantity(product.key as ProductKey, -1)}
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <span className="text-sm sm:text-base font-bold text-foreground min-w-[20px] text-center">{quantities[product.key as ProductKey]}</span>
                            <Button
                              variant="default"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow hover:shadow-md"
                              onClick={() => updateQuantity(product.key as ProductKey, 1)}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                          <div className="text-right sm:hidden">
                            <div className="font-bold text-lg sm:text-2xl text-foreground">${(product.price * quantities[product.key as ProductKey]).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="font-bold text-lg md:text-xl lg:text-2xl text-foreground">${(product.price * quantities[product.key as ProductKey]).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Blank placeholders to keep height consistent */}
                  {placeholders.map((_, idx) => (
                    <div key={`placeholder-${idx}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-h-[140px] sm:min-h-[180px] opacity-0 pointer-events-none select-none">
                      <div className="w-full sm:w-36 md:w-40 lg:w-44 h-36 sm:h-36 md:h-40 lg:h-44 rounded-xl flex-shrink-0" />
                      <div className="flex-1 w-full min-w-0" />
                      <div className="hidden sm:block text-right" />
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  <div className="flex justify-center gap-1 sm:gap-2 mt-4 overflow-x-auto pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex gap-1 sm:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={page === i + 1 ? 'default' : 'outline'}
                          size="sm"
                          className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] ${page === i + 1 ? 'bg-primary text-primary-foreground' : ''}`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Promo Code Field */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
                    <Input
                      type="text"
                      placeholder="Promo code"
                      value={promo}
                      onChange={e => setPromo(e.target.value)}
                      className="rounded-lg text-sm sm:text-base py-2 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap"
                      onClick={() => {}}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  {/* Cart Savings */}
                  {discount > 0 && (
                    <div className="text-green-600 font-semibold text-xs sm:text-sm mt-1">You saved ${discount.toFixed(2)}!</div>
                  )}
                  
                  {/* Order Summary */}
                  <div className="bg-[#f5f5f7] rounded-lg p-3 sm:p-4 mt-4 border border-[#ececec]">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Order Summary</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>- ${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-primary font-medium">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-base sm:text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Estimated Delivery */}
                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>Estimated Delivery: <span className="font-semibold text-foreground">May 10–13</span></span>
                    </div>
                    
                    {/* Security/Trust Badge */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                      <span>Secure checkout – your information is protected</span>
                    </div>
                    
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4 sm:mt-6 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors">
                      Place Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}