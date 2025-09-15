import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/sign-in", "/sign-up", "/", "/api/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // API routes protection
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Redirect unauthenticated users from protected pages
  if (!isPublicRoute && !accessToken && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users from auth pages
  if ((pathname === "/sign-in" || pathname === "/sign-up") && accessToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
