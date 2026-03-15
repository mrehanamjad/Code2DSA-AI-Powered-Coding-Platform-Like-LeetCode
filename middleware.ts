import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 1. Allow auth related paths
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // 2. Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/problems") ||
          pathname.startsWith("/u") ||
          pathname.startsWith("/api/problems") ||
          pathname.startsWith("/api/user")
        ) {
          return true;
        }

        // 3. ADMIN ROUTE PROTECTION (New Logic)
        // If the path starts with /admin, strictly require the admin role
        if (pathname.startsWith("/admin")) {
            // Return true only if token exists AND role is admin
            return token?.role === "admin";
        }

        // 4. Default: Allow access if the user is authenticated (token exists)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};