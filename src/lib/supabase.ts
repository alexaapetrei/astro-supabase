// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   import.meta.env.PUBLIC_SUPABASE_URL,
//   import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
//   {
//     auth: {
//       flowType: "pkce", // SSR requires PKCE
//     },
//   },
// );


// import { createServerClient, type CookieOptions } from "@supabase/ssr";

// export const supabase = createServerClient(
//   import.meta.env.PUBLIC_SUPABASE_URL,
//   import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
//   {
//     cookies: {
//       get(key: string) {
//         return cookies.get(key)?.value;
//       },
//       set(key: string, value: string, options: CookieOptions) {
//         cookies.set(key, value, options);
//       },
//       remove(key: string, options) {
//         cookies.delete(key, options);
//       },
//     },
//   }
// );