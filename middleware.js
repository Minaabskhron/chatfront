import { NextResponse } from "next/server"; // Import NextResponse to manipulate HTTP response in middleware
import { getToken } from "next-auth/jwt"; // Import getToken to get the JWT token from the request

export async function middleware(req) {
  // Define middleware function, which will run on every request
  const token = await getToken({
    // Attempt to get the token from the request
    req,
    secret: process.env.AUTH_SECRET, // Use a secret for token validation
  });

  // const isHome = req.nextUrl.pathname === "/"; // Check if the current URL is the home page ("/")

  // Allow home page and static files to pass through without restrictions
  // if (isHome || req.nextUrl.pathname.startsWith("/_next")) {
  //   return NextResponse.next(); // If it's the home page or static file request, proceed normally
  // }

  // If there's no token (user not authenticated), redirect to /signin page
  // if (!token) {
  //   return NextResponse.redirect(new URL("/signin", req.url)); // Redirect to the sign-in page if no valid token
  // }

  return NextResponse.next(); // If the user is authenticated, proceed normally with the request
}

// This tells Next.js which routes to apply the middleware on
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|signin|signup).*)"], // Apply to all routes except _next, api, and favicon
};
