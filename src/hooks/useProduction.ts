// 📂 src/hooks/useProduction.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { ProductionGear } from "@/types";

// ==============================
// 📊 State Interfaces
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
/**
 * Generic Hook สำหรับดึงข้อมูลจาก Supabase
 * ใช้ลด code duplication ระหว่าง hooks ต่างๆ
 */
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
    let isMounted = true; // กัน error ตอน component unmount

    const fetchData = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const result = await queryFn();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          const errMsg = err instanceof Error ? err.message : errorMessage;
          setError(errMsg);
          console.error(errorMessage, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    // Cleanup function: กัน error ตอน component unmount
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, trigger]);

  return { data, loading, error, refetch };
}

// ==============================
// 🎥 Custom Hook: useProductionGear
// ==============================
/**
 * Custom Hook สำหรับดึงข้อมูล Production Gear จาก Supabase
 *
 * @returns {Object} - gear, loading, error
 *
 * @example
 * const { gear, loading, error } = useProductionGear();
 */
export function useProductionGear() {
  const queryFn = async () => {
    const { data, error } = await supabase
      .from("production_gear")
      .select("*")
      .order("category", { ascending: true })
      .order("name_en", { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const {
    data: gear,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<ProductionGear[]>(
    queryFn,
    [],
    [],
    "เกิดข้อผิดพลาดในการโหลดข้อมูลอุปกรณ์",
  );

  return { gear, loading, error, refetch };
}

// ==============================
// 🎯 Custom Hook: useProduction
// ==============================
/**
 * Custom Hook รวมสำหรับดึงข้อมูลทั้ง Production Works และ Gear พร้อมกัน
 *
 * @returns {Object} - works, gear, loading, error
 *
 * @example
 * const { works, gear, loading, error } = useProduction();
 */
export function useProduction() {
  const queryFn = async () => {
    // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน (Parallel fetching)
    const [worksResponse, gearResponse] = await Promise.all([
      supabase
        .from("production_works")
        .select("*")
        .order("featured", { ascending: false })
        .order("year", { ascending: false }),
      supabase
        .from("production_gear")
        .select("*")
        .order("category", { ascending: true })
        .order("name_en", { ascending: true }),
    ]);

    // ตรวจสอบ error จากทั้งสอง queries
    if (worksResponse.error) throw worksResponse.error;
    if (gearResponse.error) throw gearResponse.error;

    return {
      works: worksResponse.data || [],
      gear: gearResponse.data || [],
    };
  };

  const {
    data: { works, gear },
    loading,
    error,
    refetch,
  } = useSupabaseQuery(
    queryFn,
    [],
    { works: [], gear: [] },
    "เกิดข้อผิดพลาดในการโหลดข้อมูล Production",
  );

  return { works, gear, loading, error };
}

// ==============================
// 🎥 Custom Hook: useProductionGearById
// ==============================
/**
 * Custom Hook สำหรับดึงข้อมูล Production Gear เดียวตาม ID
 *
 * @param {number | null} id - Gear ID ที่ต้องการดึง
 * @returns {Object} - gear, loading, error
 *
 * @example
 * const { gear, loading, error } = useProductionGearById(1);
 */
export function useProductionGearById(id: number | null) {
  const queryFn = async () => {
    // ถ้าไม่มี id ให้คืนค่า null
    if (!id) return null;

    const { data, error } = await supabase
      .from("production_gear")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  };

  const {
    data: gear,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<ProductionGear | null>(
    queryFn,
    [id], // ดึงข้อมูลใหม่เมื่อ id เปลี่ยน
    null,
    "ไม่พบข้อมูลอุปกรณ์",
  );

  return { gear, loading, error, refetch };
}
