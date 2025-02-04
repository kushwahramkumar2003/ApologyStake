import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import configs from "./config";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: configs.nextAuthSecret });
  console.log("Token", token);
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/auth"];

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/auth")) {
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
