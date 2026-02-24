// 📂 src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// ค่าเหล่านี้เดี๋ยวเราจะไปเอามาจาก Supabase Dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
