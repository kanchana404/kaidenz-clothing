import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/cart', '/checkout', '/profile'];
const authRoutes = ['/login', '/sign-in', '/sign-up', '/email-verification'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cookies from the request
  const cookies = request.cookies;
  const jsessionId = cookies.get('JSESSIONID')?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing a protected route without authentication
  if (isProtectedRoute) {
    // Check if user has valid session cookie
    if (!jsessionId) {
      console.log(`Middleware: No JSESSIONID found for protected route ${pathname}, redirecting to sign-in`);
      // Redirect to login page
      const loginUrl = new URL('/sign-in', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    console.log(`Middleware: JSESSIONID found for protected route ${pathname}, allowing access`);
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && jsessionId) {
    console.log(`Middleware: JSESSIONID found for auth route ${pathname}, redirecting to home`);
    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 