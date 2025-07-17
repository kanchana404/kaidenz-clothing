'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide navbar on sign-in, sign-up, and email-verification pages
  const hideNavbar = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname.startsWith('/email-verification');
  
  if (hideNavbar) {
    return null;
  }
  
  return (
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>
  );
} 