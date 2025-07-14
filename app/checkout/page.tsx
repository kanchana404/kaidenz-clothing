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
      <div className="w-full bg-card border-b border-border py-3 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary text-primary-foreground w-7 h-7 flex items-center justify-center font-bold">1</span>
          <span className="font-medium text-sm sm:text-base">Shipping</span>
        </div>
        <span className="w-8 h-0.5 bg-border rounded" />
        <div className="flex items-center gap-2 opacity-60">
          <span className="rounded-full border border-border w-7 h-7 flex items-center justify-center font-bold">2</span>
          <span className="font-medium text-sm sm:text-base">Payment</span>
        </div>
        <span className="w-8 h-0.5 bg-border rounded" />
        <div className="flex items-center gap-2 opacity-60">
          <span className="rounded-full border border-border w-7 h-7 flex items-center justify-center font-bold">3</span>
          <span className="font-medium text-sm sm:text-base">Review</span>
        </div>
      </div>
      {/* Header */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs sm:text-sm font-medium">
        New Season Coming! Discount 10% for all product! Check out now! - 30.4R
      </div>
      {/* Main Content */}
      <main className="w-full max-w-none mx-auto flex-1 flex flex-col justify-center px-1 sm:px-2 md:px-4 py-4 sm:py-8 gap-8">
        {/* User Greeting and Help */}
        <div className="flex justify-end mb-2">
          <a href="#" className="flex items-center gap-1 text-primary hover:underline text-sm font-medium">
            <HelpCircle className="w-4 h-4" /> Need help?
          </a>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 w-full flex-1 justify-center items-stretch">
          {/* Left Side - Shipping Information */}
          <section className="w-full lg:w-1/2 bg-card rounded-2xl shadow-md p-4 sm:p-8 mb-2 lg:mb-0 flex flex-col justify-start">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-tight text-center">Shipping Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="rounded-lg text-base py-3"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="rounded-lg text-base py-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="email">Email</Label>
                  <Mail className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="rounded-lg text-base py-3 pl-9"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Phone className="absolute left-3 top-9 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="rounded-lg text-base py-3 pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Detail Address</Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleTextAreaChange}
                  placeholder="Enter your detail address"
                  className="rounded-lg text-base py-3 px-3 w-full min-h-[80px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => handleSelectChange('country', value)}>
                    <SelectTrigger className="rounded-lg text-base py-3">
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
                  <Label htmlFor="province">Province</Label>
                  <Select onValueChange={(value) => handleSelectChange('province', value)}>
                    <SelectTrigger className="rounded-lg text-base py-3" title="Enter your province/state">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select onValueChange={(value) => handleSelectChange('city', value)}>
                    <SelectTrigger className="rounded-lg text-base py-3">
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
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Select onValueChange={(value) => handleSelectChange('postalCode', value)}>
                    <SelectTrigger className="rounded-lg text-base py-3" title="Enter your postal code">
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
                <Label htmlFor="note">Order Note / Delivery Instructions</Label>
                <Input
                  id="note"
                  name="note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note for delivery (optional)"
                  className="rounded-lg text-base py-3"
                />
              </div>
            </form>
          </section>
          {/* Right Side - Order Summary */}
          <section className="w-full lg:w-1/2 max-w-full bg-card rounded-2xl shadow-lg p-2 sm:p-4 bg-[#fafbfc] border border-[#ececec]">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">Your Order</h2>
            <Card className="bg-card border border-border rounded-xl shadow-md">
              <CardContent className="p-2 sm:p-4">
                <div className="space-y-8">
                  {/* Paginated Products */}
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="flex flex-col xs:flex-row sm:flex-row items-center gap-4 min-h-[180px]">
                      <div className="w-44 h-44 bg-muted rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                        <Image src={product.image} alt={product.name} width={176} height={176} className="object-cover w-40 h-40 rounded-lg" />
                      </div>
                      <div className="flex-1 w-full min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xs text-muted-foreground">Jolt / Jackets</div>
                          {/* Product Badge/Rating */}
                          <span className="ml-2 flex items-center gap-1 text-yellow-500 text-xs font-semibold"><Star className="w-4 h-4 fill-yellow-400" /> 4.8</span>
                          <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-semibold">Best Seller</span>
                        </div>
                        <h3 className="font-bold text-base truncate text-foreground">{product.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{product.details}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full border border-border transition-shadow hover:shadow-md"
                            onClick={() => updateQuantity(product.key as ProductKey, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-base font-bold text-foreground">{quantities[product.key as ProductKey]}</span>
                          <Button
                            variant="default"
                            size="icon"
                            className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow hover:shadow-md"
                            onClick={() => updateQuantity(product.key as ProductKey, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto mt-2 sm:mt-0">
                        <div className="font-bold text-2xl text-foreground">${(product.price * quantities[product.key as ProductKey]).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  {/* Blank placeholders to keep height consistent */}
                  {placeholders.map((_, idx) => (
                    <div key={`placeholder-${idx}`} className="flex flex-col xs:flex-row sm:flex-row items-center gap-4 min-h-[180px] opacity-0 pointer-events-none select-none">
                      <div className="w-44 h-44 rounded-xl" />
                      <div className="flex-1 w-full min-w-0" />
                      <div className="text-right w-full sm:w-auto mt-2 sm:mt-0" />
                    </div>
                  ))}
                  {/* Pagination Controls */}
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3 py-1"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        className={`rounded-full px-3 py-1 ${page === i + 1 ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3 py-1"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <Separator />
                  {/* Promo Code Field */}
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="text"
                      placeholder="Promo code"
                      value={promo}
                      onChange={e => setPromo(e.target.value)}
                      className="rounded-lg text-base py-2 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg px-4 py-2"
                      onClick={() => {}}
                    >
                      Apply
                    </Button>
                  </div>
                  {/* Cart Savings */}
                  {discount > 0 && (
                    <div className="text-green-600 font-semibold text-sm mt-1">You saved ${discount.toFixed(2)}!</div>
                  )}
                  {/* Order Summary */}
                  <div className="bg-[#f5f5f7] rounded-lg p-3 mt-4 border border-[#ececec]">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-lg">Order Summary</h3>
                    <div className="space-y-2 text-base">
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
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Estimated Delivery */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Estimated Delivery: <span className="font-semibold text-foreground">May 10–13</span></span>
                    </div>
                    {/* Security/Trust Badge */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span>Secure checkout – your information is protected</span>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 py-3 text-lg font-bold rounded-xl shadow-md transition-colors">
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