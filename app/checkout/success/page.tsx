"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/ui/footer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Custom Image component with better error handling
const ProductImage = ({ src, alt, width, height, className }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/p1.png'); // Fallback to default image
    }
  };

  return (
    <Image 
      src={imgSrc}
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      onError={handleError}
      unoptimized={src.startsWith('http')} // Don't optimize external images
    />
  );
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Fetch actual order details from Stripe session
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/get-session-details?session_id=${sessionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          
          if (response.ok && data.success) {
            setOrderDetails(data.orderDetails);
                     } else {
             console.error('Failed to fetch order details:', data.error);
             // Fallback to basic order details
             setOrderDetails({
               orderId: `ORD-${Date.now()}`,
               sessionId: sessionId,
               total: '$299.99',
               estimatedDelivery: 'May 10–13, 2024',
               paymentStatus: 'paid',
               customerEmail: 'customer@example.com',
               shipping: {
                 firstName: 'John',
                 lastName: 'Doe',
                 email: 'customer@example.com',
                 phone: '',
                 address: '123 Main St',
                 province: 'Western Province',
                 city: 'Colombo',
                 postalCode: '10000',
                 note: ''
               },
               items: [
                 { 
                   name: 'Premium Jacket', 
                   quantity: 1, 
                   price: '$299.99',
                   unitPrice: '$299.99',
                   image: '/p1.png'
                 }
               ]
             });
           }
                 } catch (error) {
           console.error('Error fetching order details:', error);
           // Fallback to basic order details
           setOrderDetails({
             orderId: `ORD-${Date.now()}`,
             sessionId: sessionId,
             total: '$299.99',
             estimatedDelivery: 'May 10–13, 2024',
             paymentStatus: 'paid',
             customerEmail: 'customer@example.com',
             shipping: {
               firstName: 'John',
               lastName: 'Doe',
               email: 'customer@example.com',
               phone: '',
               address: '123 Main St',
               province: 'Western Province',
               city: 'Colombo',
               postalCode: '10000',
               note: ''
             },
             items: [
               { 
                 name: 'Premium Jacket', 
                 quantity: 1, 
                 price: '$299.99',
                 unitPrice: '$299.99',
                 image: '/p1.png'
               }
             ]
           });
         } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className={`text-center space-y-6 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Order Confirmed</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for your purchase. We've received your order and will send you a confirmation email shortly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Order Summary */}
          {orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-mono text-sm">{orderDetails.orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">{orderDetails.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge variant={orderDetails.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {orderDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
                
                {/* Shipping Information */}
                {orderDetails.shipping && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold mb-3">Shipping Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{orderDetails.shipping.firstName} {orderDetails.shipping.lastName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{orderDetails.shipping.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{orderDetails.shipping.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{orderDetails.shipping.city}, {orderDetails.shipping.province}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{orderDetails.shipping.address}</p>
                        {orderDetails.shipping.postalCode && (
                          <p className="font-medium">Postal Code: {orderDetails.shipping.postalCode}</p>
                        )}
                      </div>
                      {orderDetails.shipping.note && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Order Note</p>
                          <p className="font-medium italic">{orderDetails.shipping.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Items Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                                     {orderDetails?.items?.map((item: any, index: number) => (
                     <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                       <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                         <ProductImage 
                           src={item.image || '/p1.png'} 
                           alt={item.name} 
                           width={64} 
                           height={64} 
                           className="object-cover w-full h-full" 
                         />
                       </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Quantity: {item.quantity}</span>
                          {item.unitPrice && (
                            <span>Unit Price: {item.unitPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.price}</div>
                        {item.unitPrice && item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">
                            {item.unitPrice} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails?.createdAt ? 
                            `Ordered on ${new Date(orderDetails.createdAt).toLocaleDateString()}` : 
                            'Your order has been confirmed'
                          }
                        </p>
                      </div>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="ml-4 border-l-2 border-muted h-4"></div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        orderDetails?.paymentStatus === 'paid' ? 'bg-green-100 border-2 border-green-500' : 'border-2 border-muted'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          orderDetails?.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${orderDetails?.paymentStatus === 'paid' ? '' : 'text-muted-foreground'}`}>
                          Payment {orderDetails?.paymentStatus === 'paid' ? 'Completed' : 'Pending'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {orderDetails?.paymentStatus === 'paid' ? 
                            'Payment has been processed successfully' : 
                            'Awaiting payment confirmation'
                          }
                        </p>
                      </div>
                      <Badge variant={orderDetails?.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {orderDetails?.paymentStatus === 'paid' ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="ml-4 border-l-2 border-muted h-4"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-muted rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Processing</p>
                        <p className="text-sm text-muted-foreground">We're preparing your items</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                    <div className="ml-4 border-l-2 border-muted h-4"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-muted rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Shipped</p>
                        <p className="text-sm text-muted-foreground">Your order is on its way</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Total Breakdown */}
              {orderDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({orderDetails.items?.length || 0} items)</span>
                        <span>{orderDetails.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{orderDetails.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What's Next */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Email Confirmation</p>
                        <p className="text-muted-foreground">
                          {orderDetails?.customerEmail ? 
                            `Sent to ${orderDetails.customerEmail}` : 
                            'Check your inbox for order details'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-4 h-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Tracking Information</p>
                        <p className="text-muted-foreground">You'll receive tracking details once shipped</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-muted-foreground">{orderDetails?.estimatedDelivery || 'May 10–13, 2024'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

             
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg">Receipt</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <Button 
                     variant="outline" 
                     className="w-full"
                     disabled={downloadingReceipt}
                     onClick={async () => {
                       if (!orderDetails?.sessionId) {
                         alert('Order details not available');
                         return;
                       }
                       
                       setDownloadingReceipt(true);
                       try {
                         const response = await fetch('/api/generate-receipt', {
                           method: 'POST',
                           headers: {
                             'Content-Type': 'application/json',
                           },
                           body: JSON.stringify({
                             sessionId: orderDetails.sessionId
                           }),
                         });
                         
                         if (response.ok) {
                           // Create blob and download
                           const blob = await response.blob();
                           const url = window.URL.createObjectURL(blob);
                           const a = document.createElement('a');
                           a.href = url;
                           a.download = `receipt-${orderDetails.sessionId}.pdf`;
                           document.body.appendChild(a);
                           a.click();
                           window.URL.revokeObjectURL(url);
                           document.body.removeChild(a);
                         } else {
                           const error = await response.json();
                           alert(`Failed to generate receipt: ${error.error}`);
                         }
                       } catch (error) {
                         console.error('Error downloading receipt:', error);
                         alert('Failed to download receipt. Please try again.');
                       } finally {
                         setDownloadingReceipt(false);
                       }
                     }}
                   >
                     {downloadingReceipt ? 'Generating...' : 'Download Receipt'}
                   </Button>
                 </CardContent>
               </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>support@kaidenz.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button 
              size="lg" 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              View All Orders
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}