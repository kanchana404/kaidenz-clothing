"use client";

import Image from 'next/image'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Minus, Plus, Trash2, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
    const categories = [
        'Men\'s Clothing',
        'Women\'s Clothing',
        'Accessories',
        'Footwear',
        'Sportswear',
        'Formal Wear',
        'Casual Wear',
        'Outerwear',
        'Swimwear'
    ]

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Categories', href: '#', hasDropdown: true },
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Sale', href: '/sale' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ]
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [open, setOpen] = useState(false); // Sheet open state
    const [hasUser, setHasUser] = useState(false);
    const [cart, setCart] = useState([
        {
            id: 1,
            name: "Sentinel Jacket",
            image: "/p1.png",
            price: 49.0,
            quantity: 1,
            details: "Size: L\nColor: Gray",
        },
        {
            id: 2,
            name: "Boa Fleece Jacket",
            image: "/p2.png",
            price: 122.0,
            quantity: 2,
            details: "Size: L\nColor: Black Navy",
        },
    ]);
    const [cartSheetOpen, setCartSheetOpen] = useState(false);

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Check for session using API route
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/check-session');
                const data = await response.json();
                console.log('Session check result:', data);
                setHasUser(data.hasUser);
            } catch (error) {
                console.error('Error checking session:', error);
                setHasUser(false);
            }
        };

        checkSession();
        
        // Check periodically for session changes
        const interval = setInterval(checkSession, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="relative bg-[#111111] text-[#f6f6f6] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 ">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image
                                src="/logo_light.png"
                                alt="KAIDENZ Logo"
                                width={140}
                                height={140}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Navigation Items - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative">
                                {item.hasDropdown ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#ffcb74] group">
                                                {item.name}
                                                {/* Animated underline */}
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ffcb74] transition-all duration-300 group-hover:w-full"></span>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-96 bg-[#2f2f2f] border border-[#ffcb74] p-6">
                                            <div className="grid grid-cols-3 gap-3">
                                                {categories.map((category) => {
                                                    // Slugify category name for URL
                                                    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                    return (
                                                        <DropdownMenuItem
                                                            key={category}
                                                            className="text-[#f6f6f6] hover:bg-[#111111] hover:text-[#ffcb74] transition-all duration-200 flex items-center justify-between group cursor-pointer p-4 rounded-md"
                                                        >
                                                            <Link href={`/categories/${slug}`} className="flex items-center w-full h-full">
                                                                <span className="text-sm font-medium flex-1">{category}</span>
                                                                {/* Arrow animation */}
                                                                <svg
                                                                    className="w-3 h-3 transform transition-transform duration-200 group-hover:translate-x-1"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href={item.href} className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#ffcb74] group">
                                        {item.name}
                                        {/* Animated underline */}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ffcb74] transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sign In/Sign Up Buttons - Desktop */}
                    <div className="hidden md:flex items-center">
                        {/* Debug info - remove this later */}
                      
                        {hasUser ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="hover:opacity-80 transition-opacity duration-200">
                                        <Avatar className="border-2 border-[#ffcb74] hover:border-[#f6f6f6] transition-colors duration-200">
                                            <AvatarFallback className="bg-[#444444] text-[#ffcb74]">U</AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-[#2f2f2f] border border-[#ffcb74] p-2">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="text-[#f6f6f6] hover:bg-[#111111] hover:text-[#ffcb74] transition-all duration-200 flex items-center gap-2 cursor-pointer p-3 rounded-md">
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/cart" className="text-[#f6f6f6] hover:bg-[#111111] hover:text-[#ffcb74] transition-all duration-200 flex items-center gap-2 cursor-pointer p-3 rounded-md">
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Cart</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="text-[#ff4d4f] hover:bg-[#111111] hover:text-[#ff4d4f] transition-all duration-200 flex items-center gap-2 cursor-pointer p-3 rounded-md"
                                        onClick={async () => {
                                            try {
                                                const response = await fetch('/api/signout', { method: 'POST' });
                                                const data = await response.json();
                                                console.log('Sign out result:', data);
                                                if (data.success) {
                                                    // Refresh the page to update navbar state
                                                    window.location.reload();
                                                }
                                            } catch (error) {
                                                console.error('Error signing out:', error);
                                            }
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="items-center space-x-4">
                                <Link href="/sign-in" className="px-4 py-2 text-sm font-medium border border-[#ffcb74] rounded-lg hover:bg-[#ffcb74] hover:text-[#111111] transition-all duration-200">
                                    Sign In
                                </Link>
                                <Link href="/sign-up" className="px-4 py-2 text-sm font-medium bg-[#ffcb74] text-[#111111] rounded-lg hover:bg-[#f6f6f6] transition-all duration-200">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Cart and UserButton for mobile */}
                    <div className="hidden md:flex items-center ml-4">
                        {hasUser && (
                            <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
                                <SheetTrigger asChild>
                                    <button className="relative p-2 rounded-md hover:bg-[#2f2f2f] transition-colors duration-200" aria-label="Open cart" title="Open cart">
                                        <ShoppingCart className="w-6 h-6" />
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">{totalCount}</span>
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 bg-[#111111] text-[#f6f6f6] w-full max-w-md flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <h2 className="text-xl font-semibold mb-6">Your Cart</h2>
                                        {cart.map((item, index, arr) => (
                                            <div key={item.id}>
                                                <div className="flex gap-4 py-4">
                                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={64}
                                                            height={64}
                                                            className="object-contain w-14 h-14 bg-white rounded-md"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-base truncate">{item.name}</h3>
                                                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                                            {item.details.split('\n').map((line, i) => (
                                                                <div key={i}>{line}</div>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Button variant="outline" size="icon" className="w-6 h-6 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40 p-0" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3 text-black" /></Button>
                                                            <span className="w-6 text-center font-medium">{item.quantity}</span>
                                                            <Button variant="outline" size="icon" className="w-6 h-6 rounded-full border-muted-foreground/20 hover:border-muted-foreground/40 p-0" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3 text-black" /></Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-between">
                                                        <button className="text-muted-foreground hover:text-destructive transition-colors p-1" aria-label={`Remove ${item.name} from cart`} title={`Remove ${item.name} from cart`}><Trash2 className="w-4 h-4" /></button>
                                                        <div className="font-medium text-base mt-2">${(item.price * item.quantity).toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                {index < arr.length - 1 && <Separator className="opacity-30" />}
                                            </div>
                                        ))}
                                        {/* Subtotal */}
                                        <div className="flex justify-between items-center mt-6 text-base font-medium">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-border">
                                        <Link href="/cart" className="block w-full" onClick={() => setCartSheetOpen(false)}>
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium rounded-lg">View Cart</Button>
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>

                    {/* Mobile menu button and Sheet */}
                    <div className="md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button className="p-2 rounded-md hover:bg-[#2f2f2f] transition-colors duration-200" aria-label="Open menu" title="Open menu">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 bg-[#111111] text-[#f6f6f6] w-3/4 max-w-xs">
                                <div className="flex flex-col h-full">
                                    <div className="flex-shrink-0 flex items-center justify-center py-6">
                                        <Image src="/logo_light.png" alt="KAIDENZ Logo" width={120} height={120} priority />
                                    </div>
                                    <div className="flex flex-col gap-2 px-6">
                                        {navItems.map((item) => {
                                            if (item.hasDropdown) {
                                                return (
                                                    <div key={item.name}>
                                                        <button
                                                            className="w-full text-left py-3 px-2 text-lg font-medium hover:text-[#ffcb74] transition-colors duration-200 border-b border-[#2f2f2f] last:border-b-0 flex items-center justify-between"
                                                            onClick={() => setMobileCategoriesOpen((open) => !open)}
                                                        >
                                                            <span>{item.name}</span>
                                                            <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                        {mobileCategoriesOpen && (
                                                            <div className="pl-4 pb-2">
                                                                {categories.map((category) => {
                                                                    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                                    return (
                                                                        <Link
                                                                            key={category}
                                                                            href={`/categories/${slug}`}
                                                                            className="block py-2 px-2 text-base hover:text-[#ffcb74] transition-colors duration-200"
                                                                            onClick={() => setOpen(false)}
                                                                        >
                                                                            {category}
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="w-full text-left py-3 px-2 text-lg font-medium hover:text-[#ffcb74] transition-colors duration-200 border-b border-[#2f2f2f] last:border-b-0"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-auto flex flex-col gap-2 px-6 pb-6">
                                        {hasUser ? (
                                            <div className="space-y-3">
                                                <Link href="/profile" className="w-full px-4 py-2 text-base font-medium border border-[#ffcb74] rounded-lg hover:bg-[#ffcb74] hover:text-[#111111] transition-all duration-200 text-center flex items-center justify-center gap-2"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                                <button className="w-full px-4 py-2 text-base font-medium border border-[#ff4d4f] text-[#ff4d4f] rounded-lg hover:bg-[#ff4d4f] hover:text-[#f6f6f6] transition-all duration-200 text-center flex items-center justify-center gap-2"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch('/api/signout', { method: 'POST' });
                                                            const data = await response.json();
                                                            console.log('Mobile sign out result:', data);
                                                            if (data.success) {
                                                                setOpen(false);
                                                                window.location.reload();
                                                            }
                                                        } catch (error) {
                                                            console.error('Error signing out:', error);
                                                        }
                                                    }}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="items-center space-x-4">
                                              <Link href="/sign-in" className="w-full px-4 py-2 text-base font-medium border border-[#ffcb74] rounded-lg hover:bg-[#ffcb74] hover:text-[#111111] transition-all duration-200 text-center"
                                                  onClick={() => setOpen(false)}
                                              >
                                                  Sign In
                                              </Link>
                                              <Link href="/sign-up" className="w-full px-4 py-2 text-base font-medium bg-[#ffcb74] text-[#111111] rounded-lg hover:bg-[#f6f6f6] transition-all duration-200 text-center"
                                                  onClick={() => setOpen(false)}
                                              >
                                                  Sign Up
                                              </Link>
                                            </div>
                                        )}
                                        {/* Cart and UserButton for mobile */}
                                        {hasUser && (
                                        <div className="flex items-center justify-center gap-4 mt-4 md:hidden">
                                          <Link href="/cart" className="relative" aria-label="Cart" onClick={() => setOpen(false)}>
                                            <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                              <circle cx="9" cy="21" r="1" />
                                              <circle cx="20" cy="21" r="1" />
                                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">2</span>
                                          </Link>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar