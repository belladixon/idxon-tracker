import { createClient } from "@supabase/supabase-js";

let supabaseUrl = (process.env["SUPABASE_URL"] ?? "").trim();
const supabaseAnonKey = (process.env["SUPABASE_ANON_KEY"] ?? "").trim();

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL environment variable is required");
}
if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY environment variable is required");
}

// Normalize the URL: add https:// if missing, add .supabase.co if it's just a project ref
if (!supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://")) {
  // Check if it's a bare project ref (no dots) or a partial domain
  if (!supabaseUrl.includes(".")) {
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
  } else {
    supabaseUrl = "https://" + supabaseUrl;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SessionRow = {
  id: number;
  date: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
};
