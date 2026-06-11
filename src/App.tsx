/**
 * 🏠 App.tsx — จุดศูนย์กลางของแอป (Root Component)
 *
 * โครงสร้างหลัก:
 *   QueryClientProvider → จัดการ cache/fetch ด้วย React Query
 *     TooltipProvider → ระบบ tooltip ของ Shadcn UI
 *       LanguageProvider → Context สำหรับเปลี่ยนภาษา (TH/EN)
 *         AuthProvider → Context สำหรับจัดการ Login/Session (Supabase)
 *           BrowserRouter → ระบบ Routing ทั้งหมด
 *
 * Route แบ่งเป็น 3 กลุ่ม:
 *   1. Public Routes — หน้าที่ใครก็เข้าได้ (/, /software, /production, /about, /contact)
 *   2. Auth Route — หน้า Login (/login) — เปิดสาธารณะ
 *   3. Protected Admin Routes — หน้า Admin ทั้งหมด (/admin/*) — ต้องล็อกอินก่อน
 */

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/layout/ScrollToTop";

// — หน้าสาธารณะ (Public Pages) —
import Index from "./pages/Index";
import IT from "./pages/Software";
import ITProjectDetail from "./pages/Software_Project_Detail";
import ITArchive from "./pages/Software_Archive";
import Production from "./pages/Production";
import GearArchive from "./pages/Gear_Archive";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// — Context Providers —
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// — หน้า Admin (ต้องล็อกอิน) — โหลดแบบ lazy เพื่อแยกออกจาก bundle หลัก
// ผู้เข้าชมทั่วไปไม่ต้องดาวน์โหลดโค้ดส่วน Admin
const EditSoftware = lazy(() => import("./pages/admin/software/edit"));
const AddProduction = lazy(() => import("./pages/admin/production/add"));
const EditProduction = lazy(() => import("./pages/admin/production/edit"));
const AddSoftware = lazy(() => import("./pages/admin/software/add"));
const AddGear = lazy(() => import("./pages/admin/gear/add"));
const EditGear = lazy(() => import("./pages/admin/gear/edit"));
const AdminCompanyInfo = lazy(() => import("./pages/admin/company/index"));
const EditAbout = lazy(() => import("./pages/admin/about/edit"));
const AddBehindScene = lazy(() => import("./pages/admin/behind-scenes/add"));
const EditBehindScene = lazy(() => import("./pages/admin/behind-scenes/edit"));
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Fallback ระหว่างโหลด chunk ของหน้า Admin
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          {/* ระบบ Toast แจ้งเตือน (2 ตัว: Shadcn Toaster + Sonner) */}
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {/* ScrollToTop — เลื่อนหน้าขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า */}
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ===== Public Routes — ไม่ต้องล็อกอิน ===== */}
              <Route path="/" element={<Index />} />
              <Route path="/software" element={<IT />} />
              <Route
                path="/software/project/:projectId"
                element={<ITProjectDetail />}
              />
              <Route path="/software/archive" element={<ITArchive />} />
              <Route path="/production" element={<Production />} />
              <Route path="/production/gear" element={<GearArchive />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />

              {/* ===== Auth Route — หน้า Login (เปิดสาธารณะ) ===== */}
              <Route path="/login" element={<Login />} />

              {/* ===== 🔒 Protected Admin Routes — ต้องล็อกอินก่อนถึงจะเข้าได้ ===== */}
              {/* ProtectedRoute จะเช็ค session → ถ้าไม่ได้ล็อกอิน redirect ไป /login */}
              <Route
                path="/admin/company-info"
                element={
                  <ProtectedRoute>
                    <AdminCompanyInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/about/edit"
                element={
                  <ProtectedRoute>
                    <EditAbout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/software/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditSoftware />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/software/add"
                element={
                  <ProtectedRoute>
                    <AddSoftware />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/production/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/production/add"
                element={
                  <ProtectedRoute>
                    <AddProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gear/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditGear />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/gear/add"
                element={
                  <ProtectedRoute>
                    <AddGear />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/behind-scenes/add"
                element={
                  <ProtectedRoute>
                    <AddBehindScene />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/behind-scenes/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditBehindScene />
                  </ProtectedRoute>
                }
              />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
