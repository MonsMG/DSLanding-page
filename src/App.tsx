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

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";

// — หน้าสาธารณะ (Public Pages) —
import Index from "./pages/Index";
import IT from "./pages/IT";
import ITProjectDetail from "./pages/ITProjectDetail";
import ITArchive from "./pages/ITArchive";
import Production from "./pages/Production";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// — Context Providers —
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// — หน้า Admin (ต้องล็อกอิน) —
import EditSoftware from "./pages/admin/software/edit";
import AddProduction from "./pages/admin/production/add";
import EditProduction from "./pages/admin/production/edit";
import AddSoftware from "./pages/admin/software/add";
import AddGear from "./pages/admin/gear/add";
import EditGear from "./pages/admin/gear/edit";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          {/* ระบบ Toast แจ้งเตือน (2 ตัว: Shadcn Toaster + Sonner) */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* ScrollToTop — เลื่อนหน้าขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า */}
            <ScrollToTop />
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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />

              {/* ===== Auth Route — หน้า Login (เปิดสาธารณะ) ===== */}
              <Route path="/login" element={<Login />} />

              {/* ===== 🔒 Protected Admin Routes — ต้องล็อกอินก่อนถึงจะเข้าได้ ===== */}
              {/* ProtectedRoute จะเช็ค session → ถ้าไม่ได้ล็อกอิน redirect ไป /login */}
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
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
