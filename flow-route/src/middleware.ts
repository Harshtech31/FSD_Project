import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Public routes that don't require authentication
    const publicRoutes = ['/auth/login', '/auth/signup', '/'];
    const isPublicRoute = publicRoutes.some(route =>
        request.nextUrl.pathname === route ||
        request.nextUrl.pathname.startsWith('/api/auth/')
    );

    if (isPublicRoute) {
        // If user is already logged in and tries to access auth pages, redirect to dashboard
        if (token && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protected routes
    if (!token) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token'); // Clear any invalid tokens
        return response;
    }

    try {
        // Verify token
        await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return NextResponse.next();
    } catch (error) {
        // Invalid token
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token'); // Clear invalid token
        return response;
    }
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}; 