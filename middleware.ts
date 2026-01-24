import { NextRequest, NextResponse } from "next/server";

/**
 * Страницы, доступные ВСЕМ
 * (и гостям, и авторизованным)
 */
const PUBLIC_ROUTES = [
  "/",
  "/catalog",
  "/diplomas",
];

/**
 * Страницы ТОЛЬКО для НЕавторизованных
 * (login / register / auth)
 */
const AUTH_ONLY_ROUTES = [
  "/auth",
];

/**
 * Защищённые маршруты
 * (требуют accessToken)
 */
const PROTECTED_PREFIXES = [
  "/profile",
  "/tests",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❌ Не обрабатываем служебные маршруты
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🍪 Берём accessToken из cookie
  const accessToken = req.cookies.get("accessToken")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isAuthOnly = AUTH_ONLY_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 🔒 Нет токена — запрещаем защищённые страницы
  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 🔁 Есть токен — не пускаем на auth-страницы
  if (accessToken && isAuthOnly) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // 🌍 Public доступны всем — ничего не делаем
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
