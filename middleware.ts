import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuth = request.cookies.get('ts-admin-auth')?.value === 'true';

  // Protect Admin Dashboard Routes
  if (pathname.startsWith('/admin')) {
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

  // Protect Admin API Routes (Except Login)
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')) {
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
