import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories/men-s-clothing' },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Sale', href: '/sale' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-[#f6f6f6] border-t border-[#222] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_light.png" alt="KAIDENZ Logo" width={120} height={40} />
          </Link>
          <p className="text-sm text-[#bbbbbb] max-w-xs text-center md:text-left">
            Elevate your wardrobe with modern essentials for every season and every style.
          </p>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-[#ffcb74] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[#222] py-4 text-center text-xs text-[#bbbbbb] bg-[#111111]">
        &copy; {new Date().getFullYear()} KAIDENZ Clothing. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 