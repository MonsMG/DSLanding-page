// 📂 src/hooks/useSoftwareProjects.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { SoftwareProject } from "@/types";

// ==============================
// 📊 State Interface
// ==============================
interface UseSoftwareProjectsState {
  projects: SoftwareProject[];
  loading: boolean;
  error: string | null;
}

// ==============================
// 🎯 Custom Hook: useSoftwareProjects
// ==============================
/**
 * Custom Hook สำหรับดึงข้อมูล Software Projects จาก Supabase
 *
 * @returns {UseSoftwareProjectsState} - projects, loading, error
 *
 * @example
 * const { projects, loading, error } = useSoftwareProjects();
 */
export function useSoftwareProjects(): UseSoftwareProjectsState {
  const [projects, setProjects] = useState<SoftwareProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูลจาก Supabase
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูลจาก table software_projects
        // เรียงลำดับจากใหม่สุดไปเก่าสุด
        const { data, error: fetchError } = await supabase
          .from("software_projects")
          .select("*")
          .order("created_at", { ascending: false });

        // ตรวจสอบว่ามี error หรือไม่
        if (fetchError) {
          throw fetchError;
        }

        // อัปเดต state ด้วยข้อมูลที่ได้
        setProjects(data || []);
      } catch (err) {
        // จัดการ error โดยแปลงเป็น string
        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        setError(errorMessage);
        console.error("Error fetching software projects:", err);
      } finally {
        // ปิด loading state เสมอ
        setLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchProjects();
  }, []); // Empty dependency array = ดึงข้อมูลครั้งเดียวตอน component mount

  return { projects, loading, error };
}

// ==============================
// 🎯 Custom Hook: useSoftwareProjectById
// ==============================
/**
 * Custom Hook สำหรับดึงข้อมูล Software Project เดียวตาม ID
 *
 * @param {number | null} id - Project ID ที่ต้องการดึง
 * @returns {Object} - project, loading, error
 */
export function useSoftwareProjectById(id: number | null) {
  const [project, setProject] = useState<SoftwareProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ถ้าไม่มี id ให้รีเซ็ต state
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูล project เดียวตาม id
        const { data, error: fetchError } = await supabase
          .from("software_projects")
          .select("*")
          .eq("id", id)
          .single(); // single() = คาดหวังผลลัพธ์เพียง 1 รายการ

        if (fetchError) {
          throw fetchError;
        }

        setProject(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "ไม่พบข้อมูล Project";
        setError(errorMessage);
        console.error("Error fetching project by ID:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // ดึงข้อมูลใหม่เมื่อ id เปลี่ยน

  return { project, loading, error };
}
