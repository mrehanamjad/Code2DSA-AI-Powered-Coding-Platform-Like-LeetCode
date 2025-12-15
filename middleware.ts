import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
      // The middleware function will only be invoked if the authorized callback returns true.

    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // allow auth related paths
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // public routes
        if (pathname === "/" || pathname.startsWith("/problems") || pathname.startsWith("/u") || pathname.startsWith("/api/problems") || pathname.startsWith("/api/user")) {
          return true;
        }

        //  allow access if the user is authenticated (i.e., token exists).
        // If token is null or undefined, access is denied.
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
}
