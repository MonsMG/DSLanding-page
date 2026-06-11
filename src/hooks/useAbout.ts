// src/hooks/useAbout.ts
import { useState, useEffect, useCallback } from "react";
import { getAbout } from "@/services/aboutService";
import { AboutConfig } from "@/types/portfolio";
import { ERROR_MESSAGES } from "@/constants";

/**
 * Custom hook to fetch about config (single row).
 */
export function useAbout() {
  const [about, setAbout] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAbout();
      setAbout(data);
    } catch (err: any) {
      console.error("useAbout error:", err);
      setError(err.message || ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  return { about, loading, error, refresh: fetchAbout };
}
