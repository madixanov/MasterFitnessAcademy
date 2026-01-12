import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/catalog",
  "/diplomas",
];

const PROTECTED_PREFIXES = [
  "/profile",
  "/tests"
];


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❌ не трогаем служебные маршруты
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  // 🔒 нет токена — нельзя в protected
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 🔁 есть токен — не пускаем на auth
  if (token && isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon).*)"],
};
