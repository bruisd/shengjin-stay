import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: inject x-pathname for server components, skip i18n
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Removed "admin" exclusion so admin routes run through this function
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
