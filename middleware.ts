import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth", "/catalog", "/diplomas"];

const PROTECTED_PREFIXES = ["/profile", "/tests"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (accessToken && isPublic && pathname !== "/" && pathname !== "/diplomas" &&
      !pathname.startsWith("/diplomas/")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};