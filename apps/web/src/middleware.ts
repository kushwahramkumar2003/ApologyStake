import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import configs from "./config";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: configs.nextAuthSecret });
  console.log("middleware token", token);
  const { pathname } = req.nextUrl;
  console.log("middleware pathname", pathname);

  const publicRoutePatterns = [
    /^\/$/, // Root path
    /^\/auth$/, // Auth page
    /^\/apology\/[^/]+$/, // Matches /apology/{id}
    /^\/api\/auth\/.*/, // NextAuth.js auth routes
    /^\/api\/.*/, // API routes
    /^\/public\/.*/, // Public assets directory
  ];

  const isPublicRoute = publicRoutePatterns.some((pattern) =>
    pattern.test(pathname)
  );
  console.log("middleware isPublicRoute", isPublicRoute);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  console.log("middleware token", token);
  if (token) {
    return NextResponse.next();
  }

  console.log("middleware redirecting to /auth");
  const loginUrl = new URL("/auth", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Match all paths except these
    "/((?!_next|favicon.ico|preview.jpeg|solana-powered.svg|public).*)",
  ],
};
