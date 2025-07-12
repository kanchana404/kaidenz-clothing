"use client"
import React, { useState } from 'react';
import { Heart, Clock, Package, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import Navbar from '@/components/ui/navbar';

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);

  const productImages = [
    '/p1.png',
    '/p2.png',
    '/p3.png',
    '/p4.png',
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const recommendations = [
    {
      id: 1,
      title: 'Polo with Contrast Trims',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      rating: 4.0,
      price: 212,
      originalPrice: 239,
      discount: 25
    },
    {
      id: 2,
      title: 'Gradient Graphic T-shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      rating: 3.6,
      price: 145
    },
    {
      id: 3,
      title: 'Polo with Tipping Details',
      image: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      rating: 4.5,
      price: 180
    },
    {
      id: 4,
      title: 'Striped Jacket',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      rating: 5.0,
      price: 190,
      originalPrice: 210,
      discount: 20
    }
  ];

  const handleAddToCart = () => {
    // Add to cart logic here
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-[#ffcb74] text-[#ffcb74]' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      <div className="w-full px-12 py-12">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-none">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-3xl overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt="Loose Fit Hoodie"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="flex gap-4 justify-center">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer ${
                    selectedImage === index ? 'border-[#ffcb74]' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8 pl-8">
            <div className="text-[#ffcb74] text-lg">Men Fashion</div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">Loose Fit Hoodie</h1>
            <div className="text-4xl font-bold text-gray-900">$24.99</div>
            
            <div className="flex items-center gap-3 text-base text-gray-700">
              <Clock className="w-5 h-5 text-[#ffcb74]" />
              <span>Order in 02:30:35 to get next day delivery</span>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <Label className="text-xl font-medium text-gray-900">Select Size</Label>
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className={`px-8 py-4 text-lg font-medium rounded-full border-2 transition-colors ${
                      selectedSize === size 
                        ? 'bg-[#ffcb74] text-gray-900 border-[#ffcb74]' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#ffcb74]'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-5">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-[#ffcb74] text-gray-900 py-5 px-10 rounded-full text-lg font-medium hover:bg-[#f0b55a] transition-colors"
              >
                Add to Cart
              </Button>
              <Button
                onClick={() => setIsWishlisted(!isWishlisted)}
                variant="outline"
                className="p-5 rounded-full border-2 border-gray-300 hover:border-[#ffcb74] transition-colors bg-white"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-5">
                  <span className="text-xl font-medium text-gray-900">Description & Fit</span>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-6 h-6 text-[#ffcb74]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#ffcb74]" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-gray-700 text-base leading-relaxed pb-6 max-w-2xl">
                    Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, 
                    but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, 
                    long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. 
                    Soft, brushed inside.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Shipping */}
            <div className="border-t border-gray-200">
              <Collapsible open={isShippingOpen} onOpenChange={setIsShippingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-5">
                  <span className="text-xl font-medium text-gray-900">Shipping</span>
                  {isShippingOpen ? (
                    <ChevronUp className="w-6 h-6 text-[#ffcb74]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#ffcb74]" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#ffcb74] rounded-full flex items-center justify-center">
                        <span className="text-gray-900 text-base font-medium">50%</span>
                      </div>
                      <div>
                        <div className="font-medium text-base text-gray-900">Disc 50%</div>
                        <div className="text-gray-500 text-sm">3-4 Working Days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Package className="w-12 h-12 text-[#ffcb74]" />
                      <div>
                        <div className="font-medium text-base text-gray-900">Regular Package</div>
                        <div className="text-gray-500 text-sm">10 - 12 October 2024</div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-20 mt-20">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Rating & Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating Overview */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-8xl font-bold text-gray-900 mb-4">4.5</div>
              <div className="text-xl text-[#ffcb74] mb-6">/ 5</div>
              <div className="text-base text-gray-700">(50 New Reviews)</div>
            </div>
            
            {/* Rating Bars */}
            <div className="space-y-4">
              {[
                { stars: 5, percentage: 85 },
                { stars: 4, percentage: 65 },
                { stars: 3, percentage: 25 },
                { stars: 2, percentage: 15 },
                { stars: 1, percentage: 5 }
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <Star className="w-5 h-5 fill-[#ffcb74] text-[#ffcb74]" />
                    <span className="text-base font-medium text-gray-900">{item.stars}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[#ffcb74] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Review */}
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-start gap-5">
                <Avatar className="w-14 h-14">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">Alex Mathio</h4>
                    <span className="text-base text-[#ffcb74]">13 Oct 2024</span>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    &quot;NextGen&apos;s dedication to sustainability and ethical practices resonates strongly 
                    with today&apos;s consumers, positioning the brand as a responsible choice in the fashion world.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover rounded-lg mb-5"
                />
                <h3 className="font-medium mb-3 text-lg text-gray-900">{item.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-base text-[#ffcb74]">{item.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">${item.price}</span>
                  {item.originalPrice && (
                    <>
                      <span className="text-base text-gray-500 line-through">${item.originalPrice}</span>
                      <Badge variant="secondary" className="text-sm bg-[#ffcb74] text-gray-900">
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
    </div>
  );
};

export default ProductPage;