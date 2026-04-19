import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-based route access
const roleRoutes: Record<string, string[]> = {
  admin: ['/admin', '/kasir'],
  kasir: ['/kasir'],
  mekanik: ['/mekanik'],
  gudang: ['/gudang'],
  pimpinan: ['/pimpinan'],
}

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'))) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('access_token')?.value
  const userRole = request.cookies.get('user_role')?.value

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access for protected routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/kasir') || 
      pathname.startsWith('/mekanik') || pathname.startsWith('/gudang') || 
      pathname.startsWith('/pimpinan')) {
    
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const allowedRoutes = roleRoutes[userRole] || []
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = getDashboardByRole(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
  }

  return NextResponse.next()
}

function getDashboardByRole(role: string): string {
  switch (role) {
    case 'admin':
    case 'kasir':
      return '/admin'
    case 'mekanik':
      return '/mekanik'
    case 'gudang':
      return '/gudang'
    case 'pimpinan':
      return '/pimpinan'
    default:
      return '/login'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
