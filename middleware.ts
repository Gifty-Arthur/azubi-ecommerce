import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an unmodified response object that we can pass to the client
  // and modify if the session needs to be refreshed.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client that can be used in the middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If a cookie is set, we need to update both the request and the response.
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If a cookie is removed, update both the request and the response.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // This line is crucial. It refreshes the user's session cookie if it has expired.
  // This is the most common cause of the "Refresh Token Not Found" error.
  const { data: { user } } = await supabase.auth.getUser()

  // --- Main Logic ---
  // If the user is trying to access an admin route...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // ...and they are not a logged-in admin...
    if (!user || !user.user_metadata?.is_admin) {
        // ...redirect them to the HOMEPAGE to log in.
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If all checks pass, continue to the requested page with the (potentially updated) response object.
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}

