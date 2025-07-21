// the server config should only be used in server-side code
// like in `app/api` routes, server components, or in `getServerSideProps`
import { z } from "zod";

// Schema for SERVER-SIDE only variables
const serverSchema = z.object({
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  OPENAI_API_KEY: z.string(),

  NODE_ENV: z.string(),
});

// Validate in Node.js environment only
// if (typeof window === "undefined") {
const result = serverSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.errors.map((err) => `• ${err.path.join(".")}: ${err.message}`).join("\n");

  throw new Error(`Missing server environment variables:\n${errors}`);
}
// }

export const serverConfig = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  openaiKey: process.env.OPENAI_API_KEY!,
  env: process.env.NODE_ENV!,
};
