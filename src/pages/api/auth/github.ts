import { createServerClient , type CookieOptions } from '@supabase/ssr'
import { type APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  console.log("WAT --- code dicked", code)

  // return the user to an error page with instructions
  if (!code) return redirect('/auth/auth-code-error')
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key: string) {
          return cookies.get(key)?.value;
        },
        set(key: string, value: string, options: CookieOptions) {
          cookies.set(key, value, options);
        },
        remove(key: string, options) {
          cookies.delete(key, options);
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) redirect('/auth/auth-code-error')
  // const { access_token, refresh_token } = data.session;
  // cookies.set("sb-access-token", access_token, {
  //   sameSite: "strict",
  //   path: "/",
  //   secure: true,
  // });
  // cookies.set("sb-refresh-token", refresh_token, {
  //   sameSite: "strict",
  //   path: "/",
  //   secure: true,
  // });
  // return redirect(`/${next.slice(1)}`)
  console.log("WAT-- ", next)
  return redirect(`/dashboard`)



}