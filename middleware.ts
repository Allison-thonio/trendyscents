import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard Routes
  if (pathname.startsWith('/admin')) {
    const isAuth = request.cookies.get('ts-admin-auth')?.value === 'true';

    if (pathname === '/admin/login') {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } else {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
