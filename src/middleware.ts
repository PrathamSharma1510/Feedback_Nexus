import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const currentUrl = request.nextUrl.clone(); // Clone to safely modify if needed

  // Define paths that should redirect to the dashboard if the user is authenticated
  const publicPaths = ["/sign-in", "/sign-up", "/verify", "/"];
  const isAuthenticated = token !== null;

  // Redirect authenticated users trying to access public paths to the dashboard
  if (
    isAuthenticated &&
    publicPaths.some((path) => currentUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected paths to the sign-in page
  if (!isAuthenticated && currentUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Continue with the normal flow for all other requests
  return NextResponse.next();
}
