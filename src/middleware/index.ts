import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { defineMiddleware } from "astro:middleware";

// const protectedRoutes = ["/dashboard"];
const protectedRoutes = ["/poo"];
const redirectRoutes = ["/signin", "/register"];

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
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
    );
    if (protectedRoutes.includes(url.pathname)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");



      if (!accessToken || !refreshToken) {
        return redirect("/signin");
      }

      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      if (error) {
        cookies.delete("sb-access-token", {
          path: "/",
        });
        cookies.delete("sb-refresh-token", {
          path: "/",
        });
        return redirect("/signin");
      }

      locals.email = data.user?.email!;
      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
    }

    if (redirectRoutes.includes(url.pathname)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (accessToken && refreshToken) {
        return redirect("/dashboard");
      }
    }
    return next();
  },
);
