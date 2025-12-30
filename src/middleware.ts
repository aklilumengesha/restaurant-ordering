import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  // Ensure we read the correct cookie name depending on env/protocol
  const cookieName = process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName })

  // If no session token, redirect to sign-in with callback
  if (!token) {
    const url = new URL('/signin', req.url)
    // For any /admin sub-route, send users back to the admin dashboard after login
    const cb = req.nextUrl.pathname.startsWith('/admin') ? '/admin' : req.nextUrl.pathname
    url.searchParams.set('callbackUrl', cb)
    return NextResponse.redirect(url)
  }

  // Enforce only ADMINs and active accounts can access /admin
  const role = (token as any).role as 'ADMIN' | 'STAFF' | 'CUSTOMER' | undefined
  const isActive = (token as any).isActive
  if (role !== 'ADMIN' || isActive === false) {
    return NextResponse.redirect(new URL('/access-denied', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
