// @ts-nocheck
import { NextResponse, NextRequest } from 'next/server';
import { verifyAuthToken } from './apps/web/src/lib/auth';

const PROTECTED_PATHS = ['/dashboard', '/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await verifyAuthToken(token);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}; 