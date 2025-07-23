"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Clock, Package, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
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
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  // Get product images from backend response or use fallback
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: ProductImage) => img.url)
    : ['/p1.png', '/p2.png', '/p3.png', '/p4.png']; // Fallback images

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-square">
                <img
                  src={productImages[selectedImage]}
                  alt={product.images && product.images[selectedImage]?.altText 
                    ? product.images[selectedImage].altText 
                    : product.name}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    // Fallback to a default image if the URL fails
                    e.currentTarget.src = '/p1.png';
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              {productImages.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-gray-900 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="w-full h-full bg-white">
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-gray-600 border-gray-300 bg-white">
                {product.categoryName || 'Fashion'}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-medium text-gray-900">${product.price}</div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-amber-50 p-4 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Order in 02:30:35 to get next day delivery</span>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-900">Color</Label>
                <div className="flex gap-3">
                  {product.colors.map((color: ProductColor) => (
                    <Button
                      key={color.id}
                      variant="outline"
                      className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        selectedColor === color.name 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-900">Size</Label>
                <div className="flex gap-3">
                  {product.sizes.map((size: ProductSize) => (
                    <Button
                      key={size.id}
                      variant="outline"
                      className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        selectedSize === size.name 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedSize(size.name)}
                    >
                      {size.name}
                      {size.stockQuantity !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({size.stockQuantity})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
                {/* Show selected size price if different from base price */}
                {selectedSize && product.sizes.find(s => s.name === selectedSize)?.price && 
                 product.sizes.find(s => s.name === selectedSize)?.price !== product.price && (
                  <div className="text-sm text-gray-600">
                    Price for size {selectedSize}: ${product.sizes.find(s => s.name === selectedSize)?.price}
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-4 px-8 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </Button>
              <Button
                onClick={() => setIsWishlisted(!isWishlisted)}
                variant="outline"
                className="p-4 rounded-lg border-gray-300 hover:border-gray-400 transition-colors bg-white"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-4">
                  <span className="text-lg font-medium text-gray-900">Description & Fit</span>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-gray-600 text-sm leading-relaxed pb-6">
                    {product.description || 'No description available for this product.'}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Shipping */}
            <div className="border-t border-gray-200">
              <Collapsible open={isShippingOpen} onOpenChange={setIsShippingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-4">
                  <span className="text-lg font-medium text-gray-900">Shipping</span>
                  {isShippingOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-700 text-sm font-medium">50%</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">50% Off</div>
                        <div className="text-gray-500 text-xs">3-4 Working Days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-10 h-10 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">Regular Package</div>
                        <div className="text-gray-500 text-xs">10 - 12 October 2024</div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100 mt-16">
          <h2 className="text-2xl font-light mb-8 text-gray-900">Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Overview */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl font-semibold text-gray-900 mb-2">4.5</div>
              <div className="text-lg text-gray-500 mb-4">out of 5</div>
              <div className="text-sm text-gray-600">50 reviews</div>
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
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-900">{item.stars}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Review */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">Alex Mathio</h4>
                    <span className="text-xs text-gray-500">13 Oct 2024</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    &quot;NextGen&apos;s dedication to sustainability and ethical practices resonates strongly 
                    with today&apos;s consumers, positioning the brand as a responsible choice in the fashion world.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100 mt-8">
          <h2 className="text-3xl font-light font-semibold text-center mb-8 text-gray-900">You might also <span className='text-[#ffcb74]'>like</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-gray-50 rounded-lg overflow-hidden mb-4">
                  <div className="aspect-square bg-white">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <h3 className="font-medium mb-2 text-sm text-gray-900">{item.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-xs text-gray-500">{item.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">${item.price}</span>
                  {item.originalPrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                        -{item.discount}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;