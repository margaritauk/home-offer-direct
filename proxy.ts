import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!SUPABASE_CONFIGURED) {
    return NextResponse.next()
  }

  // Race the session refresh against a 5s timeout so a slow/unavailable
  // Supabase never blocks navigation. On timeout we pass through — the
  // dashboard has its own client-side auth guard as a fallback.
  const timeout = new Promise<{ supabaseResponse: NextResponse; user: null }>(
    (resolve) =>
      setTimeout(
        () => resolve({ supabaseResponse: NextResponse.next({ request }), user: null }),
        5000
      )
  )

  const { supabaseResponse, user } = await Promise.race([
    updateSession(request),
    timeout,
  ])

  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
