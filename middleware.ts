import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware — runs on every matched route (see `config.matcher` below).
 * NOTE: API routes are excluded from the matcher, so all API auth is handled
 * server-side via `getServerSession()` / `requireAuth()` in the route handlers.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // --- Redirect logged-in non-admins away from /admin instead of sending
    //     them to the login page (which is confusing if they ARE logged in).
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Add basic security headers to every page response
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 1. Public pages — no token required
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname.startsWith("/problems") ||
          pathname.startsWith("/u")
        ) {
          return true;
        }

        // 2. Admin pages — token must exist (role check is handled above
        //    in the middleware function, which can redirect instead of 404)
        if (pathname.startsWith("/admin")) {
          return !!token; // must be logged in at minimum; role checked above
        }

        // 3. All other pages — require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Run middleware on all paths EXCEPT:
     * - /api/*          (API routes handle their own auth server-side)
     * - /_next/static   (static assets)
     * - /_next/image    (image optimisation)
     * - /favicon.ico
     * - /public/*       (public static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};