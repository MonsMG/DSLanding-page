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
 *   4. ถ้ามี user → แสดงหน้าที่ห่อไว้ตามปกติ
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

  // ผ่านแล้ว → แสดงหน้า Admin ตามปกติ
  return <>{children}</>;
}
