import { verifyJWT, type JwtPayload } from './lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // No token: redirect to login
    return redirectToLogin(req);
  }

  let payload: JwtPayload | null = null;

  try {
    payload = verifyJWT(token);
  } catch (err) {
    console.warn('Invalid or expired JWT:', err);
    return redirectToLogin(req);
  }

  if (!payload?.isAdmin) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect everything under /dashboard
};
