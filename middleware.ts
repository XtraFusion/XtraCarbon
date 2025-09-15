import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const orgRoutes = createRouteMatcher(["/org-dashboard(.*)"]);
// const adminRoutes = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   // Protect org-dashboard routes for users with org role
//   if (orgRoutes(req)) {
//     if (!(await auth.user.publicMetadata).role === "org") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//   }

//   // Protect admin routes for admin role
//   if (adminRoutes(req)) {
//     if (!(await auth.user.publicMetadata).role === "admin") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//   }

//   // For other routes, just protect (require login)
//   await auth.protect();
// });

// export const config = {
//   matcher: ["/org-dashboard/:path*", "/admin/:path*"],
// };
