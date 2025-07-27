import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import NavbarWrapper from "@/components/navbar-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaidenz Clothing",
  description: "Kaidenz Clothing is a clothing brand that sells clothing for men and women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <WishlistProvider>
            <NavbarWrapper />
            {children}
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
   
  );
}
