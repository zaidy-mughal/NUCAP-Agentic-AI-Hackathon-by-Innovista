import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/nust-dates(.*)',
  '/universities(.*)',
  '/about(.*)',
  '/admin/login(.*)',
  '/api/admin/login(.*)'  // Add this line to allow access to admin login API
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/matches(.*)'
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  // Handle admin API routes separately
  if (request.nextUrl.pathname.startsWith('/api/admin/')) {
    // Allow access to admin login API
    if (request.nextUrl.pathname === '/api/admin/login') {
      return NextResponse.next();
    }
    
    // For other admin API routes, we'll handle authentication in the route handlers
    return NextResponse.next();
  }
  
  // Handle admin page routes
  if (isAdminRoute(request)) {
    // Allow access to admin login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // For other admin routes, we'll handle authentication in the route handlers
    return NextResponse.next();
  }
  
  // Handle regular protected routes
  if (isProtectedRoute(request)) {
    await auth.protect();
  } else if (!isPublicRoute(request)) {
    await auth.protect();
  }
}, {
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};