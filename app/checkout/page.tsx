"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, Lock, Star, HelpCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/ui/footer';
import { useAuth } from '@/lib/auth-hook';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    basePrice: number;
    description: string;
    imageUrls: string[];
  };
  color: {
    id: number;
    name: string;
  };
  qty: number;
}

interface CartData {
  items: CartItem[];
  totalPrice: number;
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    postalCode: ''
  });
  const [promo, setPromo] = useState('');
  const [note, setNote] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setError('Please sign in to checkout');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/get-cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          if (data.cartData && data.cartData.items && data.cartData.items.length > 0) {
            setCartData(data.cartData);
            setError(null);
          } else {
            setError('Your cart is empty');
            setCartData(null);
          }
        } else {
          if (response.status === 401) {
            setError('Please sign in to checkout');
          } else {
            setError(data.error || 'Failed to fetch cart');
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  // Fetch user information to pre-fill shipping form
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated) return;

      try {
        // First fetch user info from /api/userinfo
        const userInfoResponse = await fetch('/api/userinfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const userInfoData = await userInfoResponse.json();
        
        if (userInfoResponse.ok && userInfoData.authenticated) {
          // Then fetch address data from /api/user-address
          try {
            const addressResponse = await fetch('/api/user-address', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            if (addressResponse.ok) {
              const addressData = await addressResponse.json();
              
              if (addressData.status === 'success' && addressData.address) {
                // Pre-fill the form with complete user data
                setFormData({
                  firstName: userInfoData.first_name || userInfoData.firstName || '',
                  lastName: userInfoData.last_name || userInfoData.lastName || '',
                  email: userInfoData.email || '',
                  phone: addressData.address.phone?.toString() || '',
                  address: addressData.address.line1 + (addressData.address.line2 ? ', ' + addressData.address.line2 : ''),
                  province: addressData.address.province_name || '',
                  city: addressData.address.city_name || '',
                  postalCode: addressData.address.postal_code || ''
                });
              } else {
                // Fallback to userinfo data only
                setFormData({
                  firstName: userInfoData.first_name || userInfoData.firstName || '',
                  lastName: userInfoData.last_name || userInfoData.lastName || '',
                  email: userInfoData.email || '',
                  phone: '',
                  address: userInfoData.address || '',
                  province: userInfoData.province || '',
                  city: userInfoData.city || '',
                  postalCode: userInfoData.postal_code || userInfoData.postalCode || ''
                });
              }
            } else {
              // Fallback to userinfo data only
              setFormData({
                firstName: userInfoData.first_name || userInfoData.firstName || '',
                lastName: userInfoData.last_name || userInfoData.lastName || '',
                email: userInfoData.email || '',
                phone: '',
                address: userInfoData.address || '',
                province: userInfoData.province || '',
                city: userInfoData.city || '',
                postalCode: userInfoData.postal_code || userInfoData.postalCode || ''
              });
            }
          } catch (addressError) {
            console.error('Error fetching address data:', addressError);
            // Fallback to userinfo data only
            setFormData({
              firstName: userInfoData.first_name || userInfoData.firstName || '',
              lastName: userInfoData.last_name || userInfoData.lastName || '',
              email: userInfoData.email || '',
              phone: '',
              address: userInfoData.address || '',
              province: userInfoData.province || '',
              city: userInfoData.city || '',
              postalCode: userInfoData.postal_code || userInfoData.postalCode || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Don't show error for user info, just use empty form
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

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

  const updateQuantity = async (itemId: number, delta: number) => {
    if (!cartData) return;

    const currentItem = cartData.items.find(item => item.id === itemId);
    if (!currentItem) return;

    const newQuantity = currentItem.qty + delta;
    if (newQuantity <= 0) return; // Don't allow quantity to go below 1

    try {
      const response = await fetch('/api/update-cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartItemId: itemId,
          quantity: newQuantity
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state
        setCartData(prev => {
          if (!prev) return prev;
          
          const updatedItems = prev.items.map(item => 
            item.id === itemId ? { ...item, qty: newQuantity } : item
          );
          
          const newTotalPrice = updatedItems.reduce((sum, item) => 
            sum + (item.product.basePrice * item.qty), 0
          );
          
          return {
            items: updatedItems,
            totalPrice: newTotalPrice
          };
        });
      } else {
        console.error('Failed to update quantity:', data.error);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // For demo, assume a $10 discount if promo code is 'SAVE10'
  const discount = promo.trim().toUpperCase() === 'SAVE10' ? 10 : 0;
  const subtotal = cartData?.totalPrice || 0;
  const total = Math.max(0, subtotal - discount);

  const handlePlaceOrder = async () => {
    if (!cartData || !formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required shipping information');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cartData: cartData,
          shippingData: {
            ...formData,
            note: note
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg font-light">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg font-light mb-6">{error}</p>
            {!isAuthenticated && (
              <div className="space-x-4">
                <Button 
                  onClick={() => router.push('/sign-in')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/sign-up')}
                >
                  Sign Up
                </Button>
              </div>
            )}
            {isAuthenticated && (
              <Button 
                onClick={() => router.push('/cart')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Back to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg font-light mb-6">Your cart is empty</p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              
              {/* Province and City row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm sm:text-base">Province</Label>
                  <Select onValueChange={(value) => handleSelectChange('province', value)} value={formData.province}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3" title="Enter your province/state">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Central Province">Central Province</SelectItem>
                      <SelectItem value="Eastern Province">Eastern Province</SelectItem>
                      <SelectItem value="Northern Province">Northern Province</SelectItem>
                      <SelectItem value="North Central Province">North Central Province</SelectItem>
                      <SelectItem value="North Western Province">North Western Province</SelectItem>
                      <SelectItem value="Sabaragamuwa Province">Sabaragamuwa Province</SelectItem>
                      <SelectItem value="Southern Province">Southern Province</SelectItem>
                      <SelectItem value="Uva Province">Uva Province</SelectItem>
                      <SelectItem value="Western Province">Western Province</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm sm:text-base">City</Label>
                  <Select onValueChange={(value) => handleSelectChange('city', value)} value={formData.city}>
                    <SelectTrigger className="rounded-lg text-sm sm:text-base py-2 sm:py-3">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Colombo">Colombo</SelectItem>
                      <SelectItem value="Kandy">Kandy</SelectItem>
                      <SelectItem value="Galle">Galle</SelectItem>
                      <SelectItem value="Jaffna">Jaffna</SelectItem>
                      <SelectItem value="Negombo">Negombo</SelectItem>
                      <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                      <SelectItem value="Ratnapura">Ratnapura</SelectItem>
                      <SelectItem value="Trincomalee">Trincomalee</SelectItem>
                      <SelectItem value="Matara">Matara</SelectItem>
                      <SelectItem value="Batticaloa">Batticaloa</SelectItem>
                      <SelectItem value="Badulla">Badulla</SelectItem>
                      <SelectItem value="Kurunegala">Kurunegala</SelectItem>
                      <SelectItem value="Polonnaruwa">Polonnaruwa</SelectItem>
                      <SelectItem value="Nuwara Eliya">Nuwara Eliya</SelectItem>
                      <SelectItem value="Hambantota">Hambantota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Postal Code row */}
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm sm:text-base">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter your postal code"
                  className="rounded-lg text-sm sm:text-base py-2 sm:py-3"
                />
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
                  {/* Cart Items */}
                  {cartData.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-h-[140px] sm:min-h-[180px]">
                      <div className="w-full sm:w-36 md:w-40 lg:w-44 h-36 sm:h-36 md:h-40 lg:h-44 bg-muted rounded-xl flex items-center justify-center overflow-hidden shadow-md mx-auto sm:mx-0 flex-shrink-0">
                        <Image 
                          src={item.product.imageUrls && item.product.imageUrls.length > 0 ? item.product.imageUrls[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDE0NCAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDQiIGhlaWdodD0iMTQ0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03MiAzNkM2MS45NTQzIDM2IDU0IDQzLjk1NDMgNTQgNTRDNTQgNjQuMDQ1NyA2MS45NTQzIDcyIDcyQzgxLjA0NTcgNzIgODkgNjQuMDQ1NyA4OSA1NEM4OSA0My45NTQzIDgxLjA0NTcgMzYgNzIgMzZaIiBmaWxsPSIjOTRBM0E2Ii8+CjxwYXRoIGQ9Ik0zNiAxMDhDMzYgOTcuOTU0MyA0My45NTQzIDkwIDU0IDkwSDkwQzEwMC4wNDYgOTAgMTA4IDk3Ljk1NDMgMTA4IDEwOFYxMjBIMzZWMTA4WiIgZmlsbD0iIzk0QTNBNiIvPgo8L3N2Zz4K'} 
                          alt={item.product.name} 
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
                        <h3 className="font-bold text-sm sm:text-base text-foreground mb-1">{item.product.name}</h3>
                        <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                          {item.product.description.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                          {item.color && <div>Color: {item.color.name}</div>}
                        </div>
                        <div className="flex items-center justify-between sm:justify-start">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border transition-shadow hover:shadow-md"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <span className="text-sm sm:text-base font-bold text-foreground min-w-[20px] text-center">{item.qty}</span>
                            <Button
                              variant="default"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-shadow hover:shadow-md"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                          <div className="text-right sm:hidden">
                            <div className="font-bold text-lg sm:text-2xl text-foreground">${(item.product.basePrice * item.qty).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <div className="font-bold text-lg md:text-xl lg:text-2xl text-foreground">${(item.product.basePrice * item.qty).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                  
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
                    
                                         <Button 
                       className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4 sm:mt-6 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-xl shadow-md transition-colors"
                       onClick={handlePlaceOrder}
                       disabled={isProcessingPayment}
                     >
                       {isProcessingPayment ? 'Processing...' : 'Place Order'}
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