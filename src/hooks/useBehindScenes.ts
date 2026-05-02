// 📂 src/hooks/useBehindScenes.ts
/**
 * Custom Hooks สำหรับดึงข้อมูล Behind the Scenes จาก Supabase
 *
 * Hooks ที่มีให้ใช้:
 *   - useBehindScenes()        → ดึงทั้งหมด (สำหรับ Production page)
 *   - useBehindSceneById(id)   → ดึงรายการเดียว (สำหรับ Edit page)
 *
 * Table: production_behind_scenes
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { BehindScene } from "@/types";

// ==============================
// 📊 Generic State Interface
// ==============================
interface UseSupabaseQueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ==============================
// 🔧 Generic Hook: useSupabaseQuery
// ==============================
function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: unknown[] = [],
  defaultValue: T,
  errorMessage: string,
): UseSupabaseQueryState<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const result = await queryFn();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          const errMsg = err instanceof Error ? err.message : errorMessage;
          setError(errMsg);
          console.error(errorMessage, err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, trigger]);

  return { data, loading, error, refetch };
}

// ==============================
// 📸 Custom Hook: useBehindScenes
// ==============================
/**
 * ดึงรายการ Behind the Scenes ทั้งหมด เรียงตาม sort_order → created_at
 *
 * @example
 * const { behindScenes, loading, error, refetch } = useBehindScenes();
 */
export function useBehindScenes() {
  const queryFn = async () => {
    const { data, error } = await supabase
      .from("production_behind_scenes")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as BehindScene[]) || [];
  };

  const { data: behindScenes, loading, error, refetch } = useSupabaseQuery<BehindScene[]>(
    queryFn,
    [],
    [],
    "เกิดข้อผิดพลาดในการโหลดข้อมูลเบื้องหลัง",
  );

  return { behindScenes, loading, error, refetch };
}

// ==============================
// 📸 Custom Hook: useBehindSceneById
// ==============================
/**
 * ดึงข้อมูล Behind the Scene รายการเดียวตาม ID (สำหรับหน้า Edit)
 *
 * @param {number | null} id - ID ที่ต้องการดึง
 * @example
 * const { behindScene, loading, error } = useBehindSceneById(3);
 */
export function useBehindSceneById(id: number | null) {
  const queryFn = async () => {
    if (!id) return null;

    const { data, error } = await supabase
      .from("production_behind_scenes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as BehindScene;
  };

  const { data: behindScene, loading, error, refetch } = useSupabaseQuery<BehindScene | null>(
    queryFn,
    [id],
    null,
    "ไม่พบข้อมูลเบื้องหลัง",
  );

  return { behindScene, loading, error, refetch };
}
