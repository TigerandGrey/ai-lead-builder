import { createBrowserClient } from "@supabase/ssr";
import { clientConfig } from "../client-config";

export function createSupabaseBrowserClient() {
  return createBrowserClient(clientConfig.NEXT_PUBLIC_SUPABASE_URL, clientConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
