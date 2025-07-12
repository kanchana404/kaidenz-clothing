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
                                                {categories.map((category) => (
                                                    <DropdownMenuItem
                                                        key={category}
                                                        className="text-[#f6f6f6] hover:bg-[#111111] hover:text-[#ffcb74] transition-all duration-200 flex items-center justify-between group cursor-pointer p-4 rounded-md"
                                                    >
                                                        <span className="text-sm font-medium">{category}</span>
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
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <button className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#ffcb74] group">
                                        {item.name}
                                        {/* Animated underline */}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ffcb74] transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sign In/Sign Up Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="px-4 py-2 text-sm font-medium border border-[#ffcb74] rounded-lg hover:bg-[#ffcb74] hover:text-[#111111] transition-all duration-200">
                            Sign In
                        </button>
                        <button className="px-4 py-2 text-sm font-medium bg-[#ffcb74] text-[#111111] rounded-lg hover:bg-[#f6f6f6] transition-all duration-200">
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile menu button and Sheet */}
                    <div className="md:hidden">
                        <Sheet>
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
                                        {navItems.map((item) => (
                                            <button key={item.name} className="w-full text-left py-3 px-2 text-lg font-medium hover:text-[#ffcb74] transition-colors duration-200 border-b border-[#2f2f2f] last:border-b-0">
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex flex-col gap-2 px-6 pb-6">
                                        <button className="w-full px-4 py-2 text-base font-medium border border-[#ffcb74] rounded-lg hover:bg-[#ffcb74] hover:text-[#111111] transition-all duration-200">
                                            Sign In
                                        </button>
                                        <button className="w-full px-4 py-2 text-base font-medium bg-[#ffcb74] text-[#111111] rounded-lg hover:bg-[#f6f6f6] transition-all duration-200">
                                            Sign Up
                                        </button>
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