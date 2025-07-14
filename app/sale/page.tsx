"use client";
import React from "react";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const saleProducts = [
  { id: 1, name: "Sentinel Jacket", price: 49.0, image: "/p1.png", discount: 30 },
  { id: 2, name: "Boa Fleece Jacket", price: 122.0, image: "/p2.png", discount: 20 },
  { id: 3, name: "Urban Windbreaker", price: 89.0, image: "/p3.png", discount: 15 },
  { id: 4, name: "Classic Hoodie", price: 59.0, image: "/p4.png", discount: 25 },
];

export default function SalePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-50 flex flex-col">
      {/* Hero Section */}
      <div className="w-full py-16 bg-gradient-to-r from-[#ffcb74] via-[#ffb347] to-[#ff7e5f] text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow mb-4 animate-pulse">Big Sale!</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-6 animate-bounce">Up to <span className="font-bold text-4xl">30% OFF</span> on selected items</p>
        <Button className="bg-white text-[#ff7e5f] font-bold px-8 py-3 text-lg rounded-full shadow-lg hover:bg-[#fff3e0] transition-all duration-300 animate-shake">Shop Now</Button>
      </div>
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#ff7e5f]">Sale Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {saleProducts.map((product) => (
            <div key={product.id} className="relative bg-white border border-[#ffcb74] rounded-2xl shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-4 right-4 bg-[#ff7e5f] text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce z-10">
                -{product.discount}%
              </div>
              <div className="aspect-square bg-[#fff3e0] flex items-center justify-center">
                <Image src={product.image} alt={product.name} width={200} height={200} className="object-contain w-full h-full" />
              </div>
              <div className="p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2 text-[#ff7e5f]">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-[#ff7e5f]">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                  <span className="text-base line-through text-gray-400">${product.price.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-[#ffcb74] text-[#111] font-bold rounded-lg mt-2">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 