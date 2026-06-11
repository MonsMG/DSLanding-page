// src/services/gearService.ts
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/constants";
import { deleteFileByUrl } from "./storageService";

export interface GearInput {
  name_th: string;
  name_en: string;
  category: string;
  brand?: string;
  model?: string;
  image_url?: string;
  available?: boolean;
}

export interface ProductionGear extends GearInput {
  id: string;
  created_at?: string;
}

/**
 * Fetches all production gear.
 */
export async function getAllGear(): Promise<ProductionGear[]> {
  const { data, error } = await supabase
    .from(DB_TABLES.PRODUCTION_GEAR)
    .select("*")
    .order("category", { ascending: true })
    .order("name_en", { ascending: true });

  if (error) {
    console.error("Error fetching gear list:", error);
    throw new Error("Failed to load gear equipment list.");
  }

  return data || [];
}

/**
 * Fetches a single gear item by its UUID.
 */
export async function getGearById(id: string): Promise<ProductionGear> {
  const { data, error } = await supabase
    .from(DB_TABLES.PRODUCTION_GEAR)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching gear with ID ${id}:`, error);
    throw new Error("Failed to load gear equipment details.");
  }

  return data;
}

/**
 * Creates a new gear item.
 */
export async function createGear(data: GearInput): Promise<ProductionGear> {
  const { data: result, error } = await supabase
    .from(DB_TABLES.PRODUCTION_GEAR)
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating gear:", error);
    throw new Error("Failed to save new gear item.");
  }

  return result;
}

/**
 * Updates an existing gear item.
 * Optionally deletes the old image if a new one is provided.
 */
export async function updateGear(
  id: string,
  data: Partial<GearInput>,
  oldImageUrl?: string
): Promise<ProductionGear> {
  // If we have a new image and an old image, delete the old one
  if (data.image_url && oldImageUrl && data.image_url !== oldImageUrl) {
    await deleteFileByUrl(oldImageUrl);
  }

  const { data: result, error } = await supabase
    .from(DB_TABLES.PRODUCTION_GEAR)
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating gear ID ${id}:`, error);
    throw new Error("Failed to update gear item.");
  }

  return result;
}

/**
 * Deletes a gear item and deletes its associated image from storage.
 */
export async function deleteGear(id: string, imageUrl?: string): Promise<void> {
  // Delete database record first
  const { error } = await supabase
    .from(DB_TABLES.PRODUCTION_GEAR)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting gear ID ${id}:`, error);
    throw new Error("Failed to delete gear item.");
  }

  // Then clean up its image in storage
  if (imageUrl) {
    await deleteFileByUrl(imageUrl);
  }
}
