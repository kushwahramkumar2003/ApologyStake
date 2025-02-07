import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import configs from "./config";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: configs.nextAuthSecret });
  const { pathname } = req.nextUrl;

  // Define public route patterns
  const publicRoutePatterns = [
    /^\/$/, // Root path
    /^\/auth$/, // Auth page
    /^\/apology\/[^/]+$/, // Matches /apology/{id}
    /^\/api\/auth\/.*/, // NextAuth.js auth routes
  ];

  // Check if the pathname matches any public route pattern
  const isPublicRoute = publicRoutePatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
