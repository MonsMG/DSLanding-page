/**
 * 🔐 AuthContext — จัดการระบบ Login / Session ทั้งแอป
 *
 * ให้บริการ:
 *   - session → ข้อมูล session ปัจจุบัน (หรือ null ถ้ายังไม่ล็อกอิน)
 *   - user → ข้อมูลผู้ใช้ (email, id ฯลฯ)
 *   - loading → กำลังเช็คกับ Supabase อยู่หรือเปล่า
 *   - signOut() → ฟังก์ชันสำหรับ Logout
 *
 * วิธีใช้ในคอมโพเนนต์อื่น:
 *   const { user, loading, signOut } = useAuth();
 *
 * หมายเหตุ:
 *   - AuthProvider ต้องห่ออยู่ด้านนอกสุดใน App.tsx
 *   - ใช้ Supabase onAuthStateChange เพื่อฟังการเปลี่ยน session แบบ realtime
 *   - จะไม่ render children จนกว่า loading จะเป็น false (ป้องกัน flash)
 */

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

// — Type ของ Context —
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// — สร้าง Context พร้อมค่า default —
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

/**
 * AuthProvider — ห่อแอปทั้งหมดเพื่อให้ทุกหน้าเข้าถึงสถานะ Auth ได้
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ขั้นตอนที่ 1: เช็ค session เริ่มต้น (เวลาเปิดแอปครั้งแรก/รีเฟรช)
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    // ขั้นตอนที่ 2: ฟังการเปลี่ยนแปลง session แบบ realtime (Login/Logout/Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup: ยกเลิก subscription เมื่อ unmount
    return () => subscription.unsubscribe();
  }, []);

  // ฟังก์ชัน Logout
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {/* ไม่ render children จนกว่า loading เป็น false → ป้องกันหน้าจอกระพริบ */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth() — Hook สำหรับดึงข้อมูล Auth ไปใช้ในคอมโพเนนต์
 * ตัวอย่าง: const { user, signOut } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);
