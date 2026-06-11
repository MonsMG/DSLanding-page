// src/services/aboutService.ts
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/constants";
import { AboutConfig } from "@/types/portfolio";

/**
 * Fetches the about config (single row).
 * Returns null if not found.
 */
export async function getAbout(): Promise<AboutConfig | null> {
  const { data, error } = await supabase
    .from(DB_TABLES.ABOUT)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching about config:", error);
    throw new Error("Failed to fetch profile settings.");
  }

  return data;
}

/**
 * Upserts the about config.
 * Relies on Supabase RLS to authenticate the request.
 */
export async function upsertAbout(data: Partial<Omit<AboutConfig, "updated_at">>): Promise<AboutConfig> {
  // If id is not provided, fetch existing or perform upsert on single row.
  const existing = await getAbout();
  const payload = {
    ...data,
    id: existing?.id || undefined, // Supabase can generate UUID if undefined
  };

  const { data: result, error } = await supabase
    .from(DB_TABLES.ABOUT)
    .upsert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error upserting about config:", error);
    throw new Error("Failed to save profile settings.");
  }

  return result;
}
