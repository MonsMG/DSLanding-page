import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 🔒 ProtectedRoute — คอมโพเนนต์สำหรับป้องกันหน้า Admin
 *
 * วิธีใช้:
 *   <ProtectedRoute>
 *     <AdminPage />
 *   </ProtectedRoute>
 *
 * การทำงาน:
 *   1. ดึงสถานะ user จาก AuthContext (Supabase Session)
 *   2. ถ้ากำลังโหลด → แสดง spinner เพื่อไม่ให้หน้าจอกระพริบ
 *   3. ถ้าไม่มี user (ไม่ได้ล็อกอิน) → redirect ไปหน้า /login ทันที
 *   4. ถ้าล็อกอินแล้วแต่ "ไม่ใช่ admin" → redirect ไปหน้า /login เช่นกัน
 *   5. ถ้าเป็น admin → แสดงหน้าที่ห่อไว้ตามปกติ
 *
 * หมายเหตุความปลอดภัย:
 *   - การเช็คนี้เป็นแค่ "ด่านหน้าจอ (UX)" — ด่านจริงคือ RLS policy ใน DB
 *     (policy admin_insert/update/delete ที่อ้างอิง app_metadata.role = 'admin')
 *   - role อยู่ใน app_metadata ซึ่งตั้งฝั่ง server เท่านั้น ผู้ใช้แก้เองไม่ได้
 *   - app_metadata จะติดมากับ JWT หลัง "ล็อกอินใหม่" หรือ token refresh
 *     ถ้าเพิ่งตั้ง role ให้บัญชี ต้อง logout/login ใหม่ก่อนถึงจะผ่าน
 *
 * ใช้ใน App.tsx เพื่อห่อทุก Route ที่ขึ้นต้นด้วย /admin/*
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // กำลังตรวจสอบ session กับ Supabase → รอก่อน
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ไม่มี session → เตะไปหน้า Login (replace เพื่อไม่ให้กดย้อนกลับมาได้)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ล็อกอินแล้วแต่ไม่ใช่ admin → ไม่ให้เข้า (กันบัญชีทั่วไปเข้า /admin)
  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // ผ่านแล้ว → แสดงหน้า Admin ตามปกติ
  return <>{children}</>;
}
