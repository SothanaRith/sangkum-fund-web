import { NextResponse } from 'next/server';

/**
 * Next.js Middleware to protect routes at the URL level
 * This runs before pages are rendered
 * Prevents unauthorized direct URL access
 */

const PROTECTED_ROUTES = {
  // Admin routes - require admin role
  '/admin': 'ADMIN',
  '/admin/control': 'ADMIN',
  '/admin/charities': 'ADMIN',
  '/admin/donations': 'ADMIN',
  '/admin/moderation': 'ADMIN',
  '/admin/events': 'ADMIN',
  '/admin/blog': 'ADMIN',
  
  // Authenticated routes - require login
  '/dashboard': 'USER',
  '/dashboard/my-events': 'USER',
  '/dashboard/my-donations': 'USER',
  '/settings': 'USER',
  '/cards': 'USER',
  
  // Event owner routes - require event ownership (checked at page level)
  '/events/create': 'USER',
};

const PUBLIC_ROUTES = [
  '/',
  '/about-us',
  '/contact',
  '/how-it-works',
  '/privacy-policy',
  '/terms-of-service',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/login-otp',
  '/help-center',
  '/guide',
  '/blog',
  '/events',
  '/charities',
  '/tips',
  '/business-card',
  '/feedback',
  '/survey',
  '/announcements',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const userCookie = request.cookies.get('user')?.value;

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {
      console.error('Failed to parse user cookie:', e);
    }
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  if (isPublicRoute) {
    // Allow public routes
    return NextResponse.next();
  }

  // Check if route is protected
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  if (protectedRoute) {
    const requiredRole = PROTECTED_ROUTES[protectedRoute];

    // Check authentication
    if (!accessToken || !user) {
      // Redirect to login with return URL
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Check role-based authorization
    if (requiredRole === 'ADMIN') {
      const isAdmin = user.role === 'ADMIN' || user.isAdmin === true;
      if (!isAdmin) {
        // Redirect to home if not admin
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }

    // Role check passed, allow request
    return NextResponse.next();
  }

  // Allow any other routes
  return NextResponse.next();
}

// Configure which routes to apply middleware to
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

export default middleware;
