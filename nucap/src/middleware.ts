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
  '/admin/login(.*)'
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
  // Handle admin routes separately
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