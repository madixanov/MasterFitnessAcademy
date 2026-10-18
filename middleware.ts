import { NextRequest, NextResponse } from "next/server";

// Публичные маршруты, доступные без accessToken
const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/catalog",
  "/diplomas",
];

// Префиксы защищённых маршрутов
const PROTECTED_PREFIXES = [
  "/profile",
  "/tests",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❌ Не трогаем служебные маршруты
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Берём accessToken из HTTP-only cookie
  const accessToken = req.cookies.get("accessToken")?.value;
  // refreshToken хранится в cookie, но здесь не нужен
  // const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isDiplomaRoute =
    pathname === "/diplomas" || pathname.startsWith("/diplomas/");

  // 🔒 Нет accessToken — нельзя заходить в защищённые маршруты
  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 🔁 Есть accessToken — не пускаем на публичные страницы (кроме "/")
  if (accessToken && isPublic && pathname !== "/" && !isDiplomaRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
