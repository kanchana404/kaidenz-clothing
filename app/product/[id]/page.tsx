"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Clock, Package, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/ui/footer';
import { useAuth } from '@/lib/auth-hook';
import { toast } from 'sonner';

// TypeScript interfaces for the product data
interface ProductColor {
  id: number;
  name: string;
}

interface ProductSize {
  id: number;
  name: string;
  stockQuantity: number;
  price?: number;
}

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  qty: number;
  categoryName?: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
}

const ProductPage = () => {
  const params = useParams();
  const productId = params.id;
  const { isAuthenticated, addToCart } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      console.log('Fetching product with ID:', productId);
      
      try {
        setLoading(true);
        const response = await fetch(`/api/get-single-product?id=${productId}`);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success) {
          setProduct(data.product);
          console.log('Product loaded successfully:', data.product);
          
          // Set default selections if available
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0].name);
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0].name);
          }
        } else {
          setError(data.error || 'Failed to fetch product');
          console.error('API Error:', data.error);
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Set default selected image to primary image if available
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const primaryImageIndex = product.images.findIndex(img => img.isPrimary);
      if (primaryImageIndex !== -1) {
        setSelectedImage(primaryImageIndex);
      }
    }
  }, [product]);

  const recommendations = [
    {
      id: 1,
      title: 'Polo with Contrast Trims',
      image: '/p1.png',
      rating: 4.0,
      price: 212,
      originalPrice: 239,
      discount: 25
    },
    {
      id: 2,
      title: 'Gradient Graphic T-shirt',
      image: '/p2.png',
      rating: 3.6,
      price: 145
    },
    {
      id: 3,
      title: 'Polo with Tipping Details',
      image: '/p3.png',
      rating: 4.5,
      price: 180
    },
    {
      id: 4,
      title: 'Striped Jacket',
      image: '/p4.png',
      rating: 5.0,
      price: 190,
      originalPrice: 210,
      discount: 20
    }
  ];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("You have to sign in to add products to the cart");
      return;
    }

    if (!product) {
      toast.error("Product data not available");
      return;
    }

    // Show loading state and store the toast ID
    const loadingToast = toast.loading("Adding to cart...");
    
    const result = await addToCart(product.id, 1, 1);
    
    // Dismiss the loading toast
    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success("Product added to cart!");
    } else {
      toast.error(result.error || "Failed to add product to cart");
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 sm:h-10 lg:h-12 w-full" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-16" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Product not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get product images from backend response or use fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: ProductImage) => img.url)
    : ['/p1.png', '/p2.png', '/p3.png', '/p4.png']; // Fallback images

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.images && product.images[selectedImage]?.altText 
                      ? product.images[selectedImage].altText 
                      : product.name}
                    className="w-full h-full object-contain p-4 sm:p-6 lg:p-8"
                    onError={(e) => {
                      e.currentTarget.src = '/p1.png';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {productImages.map((image: string, index: number) => (
                <Card
                  key={index}
                  className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary' 
                      : 'hover:ring-1 hover:ring-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardContent className="p-0 h-full">
                    <img
                      src={image}
                      alt={product.images && product.images[index]?.altText 
                        ? product.images[index].altText 
                        : `${product.name} - View ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = '/p1.png';
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <Badge variant="secondary">
                {product.categoryName || 'Fashion'}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light tracking-tight">
                {product.name}
              </h1>
              <div className="text-2xl sm:text-3xl font-semibold">${product.price}</div>
            </div>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Order in 02:30:35 to get next day delivery
              </AlertDescription>
            </Alert>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: ProductColor) => (
                    <Button
                      key={color.id}
                      variant={selectedColor === color.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color.name)}
                      className="min-w-0"
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: ProductSize) => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size.name)}
                      className="min-w-0"
                    >
                      {size.name}
                      {size.stockQuantity !== undefined && (
                        <span className="ml-1 text-xs opacity-70">
                          ({size.stockQuantity})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
                {selectedSize && product.sizes.find(s => s.name === selectedSize)?.price && 
                 product.sizes.find(s => s.name === selectedSize)?.price !== product.price && (
                  <p className="text-sm text-muted-foreground">
                    Price for size {selectedSize}: ${product.sizes.find(s => s.name === selectedSize)?.price}
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 order-1 sm:order-none"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                onClick={() => setIsWishlisted(!isWishlisted)}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span className="ml-2 sm:hidden">Add to Wishlist</span>
              </Button>
            </div>

            <Separator />

            {/* Description */}
            <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto">
                  <span className="text-lg font-medium">Description & Fit</span>
                  {isDescriptionOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Shipping */}
            <Collapsible open={isShippingOpen} onOpenChange={setIsShippingOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto">
                  <span className="text-lg font-medium">Shipping</span>
                  {isShippingOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">50% Off</div>
                      <div className="text-muted-foreground text-xs">3-4 Working Days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-10 w-10 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm">Regular Package</div>
                      <div className="text-muted-foreground text-xs">10 - 12 October 2024</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-2xl font-light">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Rating Overview */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-2">4.5</div>
                <div className="text-base lg:text-lg text-muted-foreground mb-4">out of 5</div>
                <div className="text-sm text-muted-foreground">50 reviews</div>
              </div>
              
              {/* Rating Bars */}
              <div className="space-y-3">
                {[
                  { stars: 5, percentage: 85 },
                  { stars: 4, percentage: 65 },
                  { stars: 3, percentage: 25 },
                  { stars: 2, percentage: 15 },
                  { stars: 1, percentage: 5 }
                ].map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 min-w-[50px] lg:min-w-[60px]">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{item.stars}</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Review */}
              <Card className="md:col-span-1">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">Alex Mathio</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">13 Oct 2024</span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {renderStars(5)}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        &quot;NextGen&apos;s dedication to sustainability and ethical practices resonates strongly 
                        with today&apos;s consumers, positioning the brand as a responsible choice in the fashion world.&quot;
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-light text-center">
              You might also <span className="text-primary">like</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {recommendations.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-3 lg:mt-4 space-y-2">
                    <h3 className="font-medium text-xs sm:text-sm line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex gap-0.5 lg:gap-1">
                        {renderStars(item.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">${item.price}</span>
                      {item.originalPrice && (
                        <>
                          <span className="text-xs text-muted-foreground line-through">${item.originalPrice}</span>
                          <Badge variant="secondary" className="text-xs">
                            -{item.discount}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;