import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          req.cookies.set({ name, value, ...options });
          NextResponse.next({ request: { headers: req.headers }});
        },
        remove(name: string, options) {
          req.cookies.set({ name, value: '', ...options });
          NextResponse.next({ request: { headers: req.headers }});
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If the user is trying to access an admin route...
  if (pathname.startsWith('/admin')) {
    // ...but is NOT trying to access the login or register pages themselves...
    if (pathname !== '/admin/login' && pathname !== '/admin/register') {
      // ...and if they are not a logged-in admin...
      if (!user || !user.user_metadata?.is_admin) {
        // ...redirect them to the admin login page.
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }
  }

  return res;
}

// Ensure the middleware runs for all admin paths
export const config = {
  matcher: ['/admin/:path*'],
};

