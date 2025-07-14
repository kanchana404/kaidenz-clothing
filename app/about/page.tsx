import React from "react";
import Footer from "@/components/ui/footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-20 flex-1 flex flex-col items-center text-center">
        <Image src="/logo_light.png" alt="Kaidenz Logo" width={120} height={120} className="mb-8" />
        <h1 className="text-5xl font-bold mb-6 text-primary">About Kaidenz Clothing</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Kaidenz Clothing is a modern fashion brand dedicated to providing stylish, comfortable, and affordable clothing for everyone. Our mission is to empower self-expression and confidence through fashion, blending timeless classics with the latest trends.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Quality</h2>
            <p className="text-sm text-muted-foreground">We use premium materials and expert craftsmanship to ensure every piece meets the highest standards.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Sustainability</h2>
            <p className="text-sm text-muted-foreground">We are committed to ethical sourcing and sustainable practices to protect our planet for future generations.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Community</h2>
            <p className="text-sm text-muted-foreground">We believe in giving back and supporting our community through various initiatives and partnerships.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 