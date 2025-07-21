import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/jobs(.*)",
  "/post-job(.*)",
  "/my-jobs(.*)",
  "/saved-jobs(.*)",
  "/job/:id(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();

  if(!userId && isProtectedRoute(req)){
    return NextResponse.redirect(new URL("/?sign-in=true", req.url));
  }

  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    const unsafeMetadata = user.unsafeMetadata;

    if (user !== undefined && !unsafeMetadata?.role && req.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};