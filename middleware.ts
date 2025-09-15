import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Public routes that don't require authentication
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/login',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/',
  '/contact',
  '/forgot-password'
];

// Routes that require specific roles
const orgRoutes = ['/org/dashboard'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  try {
    // Verify authentication token
    const user = await verifyToken(request);
    
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check role-based access
    if (orgRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'org') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
