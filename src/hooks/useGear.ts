// src/hooks/useGear.ts
import { useState, useEffect, useCallback } from "react";
import { getAllGear, getGearById, ProductionGear } from "@/services/gearService";
import { ERROR_MESSAGES } from "@/constants";

/**
 * Custom hook to fetch all production gear.
 */
export function useGear() {
  const [gear, setGear] = useState<ProductionGear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGear = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllGear();
      setGear(data);
    } catch (err: any) {
      console.error("useGear error:", err);
      setError(err.message || ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGear();
  }, [fetchGear]);

  return { gear, loading, error, refresh: fetchGear };
}

/**
 * Custom hook to fetch a single gear item by ID.
 */
export function useGearById(id: string | null) {
  const [gearItem, setGearItem] = useState<ProductionGear | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGearItem = useCallback(async () => {
    if (!id) {
      setGearItem(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getGearById(id);
      setGearItem(data);
    } catch (err: any) {
      console.error(`useGearById (${id}) error:`, err);
      setError(err.message || ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGearItem();
  }, [fetchGearItem]);

  return { gearItem, loading, error, refresh: fetchGearItem };
}
