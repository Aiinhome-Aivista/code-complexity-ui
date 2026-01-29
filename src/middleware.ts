import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware only runs for Security, not for API proxying.
// This middleware only runs for Security, not for API proxying.
export function middleware(request: NextRequest) {
  // Authentication is now handled client-side in AuthProvider.tsx
  return NextResponse.next();
}

// ✅ Configure it to IGNORE api paths and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are handled by next.config.ts rewrites now)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
