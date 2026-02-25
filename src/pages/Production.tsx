/**
 * 🎬 Production.tsx — หน้าแสดงผลงาน Production + อุปกรณ์ + บริการ
 *
 * แบ่งเป็น 4 sections:
 *   1. Our Works — ดึงจาก Supabase (dynamic)
 *   2. Services — ข้อมูล static
 *   3. Behind the Scenes — ข้อมูล static
 *   4. Our Gear — ดึงจาก Supabase (dynamic)
 *
 * สำหรับ Admin (login แล้ว):
 *   - ปุ่ม Add Work / Add Gear
 *   - ปุ่ม Edit / Delete บนแต่ละ item (hover overlay)
 *   - Delete ใช้ AlertDialog ยืนยัน
 */

import { useState } from "react";
import {
  Play,
  Camera,
  Film,
  Scissors,
  Image as ImageIcon,
  Video,
  Loader2,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import { useProduction } from "@/hooks/useProduction";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const serviceIcons: Record<string, LucideIcon> = {
  video: Video,
  photography: Camera,
  editing: Scissors,
};

const Production = () => {
  const { t, language } = useLanguage();
  const { production } = contentData;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ดึงข้อมูลจริงจาก Supabase
  const { works, gear, loading } = useProduction();

  // State สำหรับ delete (ป้องกัน double-click)
  const [deletingWorkId, setDeletingWorkId] = useState<number | null>(null);
  const [deletingGearId, setDeletingGearId] = useState<number | null>(null);

  // Helper เลือกภาษา
  const getLang = (en: string | undefined, th: string | undefined) => {
    return language === "en" ? en || th || "" : th || en || "";
  };

  // ✅ Delete Work handler (AlertDialog + toast)
  const handleDeleteWork = async (id: number) => {
    setDeletingWorkId(id);
    try {
      const { error } = await supabase
        .from("production_works")
        .delete()
        .eq("id", id);

      if (error) {
        if (
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission")
        ) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You do not have permission.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete. Please try again.",
          });
        }
        return;
      }
      toast({ title: "Deleted", description: "Work deleted successfully." });
      window.location.reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setDeletingWorkId(null);
    }
  };

  // ✅ Delete Gear handler (AlertDialog + toast)
  const handleDeleteGear = async (id: number) => {
    setDeletingGearId(id);
    try {
      const { error } = await supabase
        .from("production_gear")
        .delete()
        .eq("id", id);

      if (error) {
        if (
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission")
        ) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You do not have permission.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete. Please try again.",
          });
        }
        return;
      }
      toast({ title: "Deleted", description: "Gear deleted successfully." });
      window.location.reload();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setDeletingGearId(null);
    }
  };

  const services = [
    { key: "video", ...production.services.video },
    { key: "photography", ...production.services.photography },
    { key: "editing", ...production.services.editing },
  ];

  // (Behind the Scenes: Static Data — ไม่ต้องแก้บ่อย)
  const behindScenes = [
    { id: 1, ...production.behindScenes.onSet },
    { id: 2, ...production.behindScenes.teamMeeting },
    { id: 3, ...production.behindScenes.equipmentSetup },
    { id: 4, ...production.behindScenes.postProduction },
    { id: 5, ...production.behindScenes.locationScout },
    { id: 6, ...production.behindScenes.clientReview },
  ];

  return (
    <div className="min-h-screen bg-card relative overflow-hidden">
      <Navigation />

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-cream))] to-white" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[hsl(var(--ds-beige))]/60 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Cover Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-left sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-4 animate-fade-in-up">
            {production.heroTitle}
          </h1>
          <p className="text-left sm:text-2xl text-[hsl(var(--ds-chocolate))]/80 font-medium mb-4 animate-fade-in-up stagger-2">
            {t(production.heroSubtitle)}
          </p>
        </div>
      </section>
      {/* Loading State */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading production data...</p>
        </div>
      ) : (
        <>
          {/* ===== SECTION 1: OUR WORKS (Dynamic) ===== */}
          <section className="relative z-10 py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 animate-fade-in-up">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.workSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.work)}
                </h2>
                {/* 🔐 Admin Controls */}
                {user && (
                  <div className="flex gap-2 bg-white/80 p-2 rounded-lg border border-primary/20 shadow-lg w-fit justify-self-end">
                    <Button asChild size="sm">
                      <Link to="/admin/production/add">
                        <Plus className="mr-2 h-4 w-4" /> Add Work
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Grid Layout — Admin: image overlay / User: bento cards with thumbnails */}
              {user ? (
                /* 🔐 Admin View — image overlay cards + Edit/Delete */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto md:auto-rows-[220px]">
                  {works.map((item, idx) => {
                    // Bento staggered pattern แบบเดียวกับ User
                    const bentoPositions = [
                      "md:col-start-1 md:row-start-1",
                      "md:col-start-2 md:row-start-1 md:row-span-2",
                      "md:col-start-3 md:row-start-1",
                      "md:col-start-3 md:row-start-2",
                      "md:col-start-1 md:row-start-3",
                      "md:col-start-2 md:row-start-3",
                    ];
                    const posClass =
                      bentoPositions[idx % bentoPositions.length] || "";

                    return (
                      <a
                        key={item.id}
                        href={item.media_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        // เพิ่มคำว่า relative เข้าไป เพื่อให้ปุ่ม Admin เกาะอยู่มุมขวาบนของการ์ด
                        className={`group relative flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${posClass}`}
                      >
                        {/* Thumbnail Area */}
                        <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-transparent min-h-[140px]">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={getLang(item.title_en, item.title_th)}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                              <Film
                                className="w-8 h-8 opacity-80"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}

                          {/* เงาดำบางๆ โผล่มาตอน Hover เพื่อให้ปุ่ม Admin ชัดขึ้น (เฉพาะกรณีมีรูป) */}
                          {item.thumbnail_url && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          )}
                        </div>

                        {/* Info Area */}
                        <div className="p-6 text-center bg-card relative z-10 flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">
                            {item.category || "Production"}
                          </span>
                          <h3 className="text-base font-bold text-[hsl(var(--ds-chocolate))] line-clamp-2">
                            {getLang(item.title_en, item.title_th)}
                          </h3>
                        </div>

                        {/* 🔐 Admin Overlay Buttons (ย้ายมาไว้ตรงนี้) */}
                        <div className="absolute top-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/admin/production/edit/${item.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8 shadow-sm"
                                disabled={deletingWorkId === item.id}
                                onClick={(e) => e.preventDefault()}
                              >
                                {deletingWorkId === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ยืนยันการลบ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ลบ "{getLang(item.title_en, item.title_th)}" —
                                  การลบจะไม่สามารถกู้คืนได้
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.preventDefault(); // ป้องกันไม่ให้การกด Delete ทะลุไปเปิดลิงก์
                                    handleDeleteWork(item.id);
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                /* 👤 User View — Bento staggered cards with thumbnail images */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto md:auto-rows-[220px]">
                  {works.map((item, idx) => {
                    // Bento staggered pattern (Matches the exact layout in the image)
                    const bentoPositions = [
                      "md:col-start-1 md:row-start-1", // Item 0: Top Left
                      "md:col-start-2 md:row-start-1 md:row-span-2", // Item 1: Center (Tall Card - spans 2 rows)
                      "md:col-start-3 md:row-start-1", // Item 2: Top Right
                      "md:col-start-3 md:row-start-2", // Item 3: Middle Right
                      "md:col-start-1 md:row-start-3", // Item 4: Bottom Left
                      "md:col-start-2 md:row-start-3", // Item 5: Bottom Center
                    ];

                    // วนลูป pattern เดิมกรณีที่ข้อมูลมีมากกว่า 6 ตัว
                    const posClass =
                      bentoPositions[idx % bentoPositions.length] || "";

                    return (
                      <a
                        key={item.id}
                        href={item.media_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`group flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${posClass}`}
                      >
                        {/* Thumbnail / Icon Area (ใช้ flex-1 เพื่อให้การ์ดตรงกลางขยายความสูงได้เต็ม) */}
                        <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-transparent min-h-[140px]">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={getLang(item.title_en, item.title_th)}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            // กรณีไม่มีรูป จะแสดง Icon สไตล์มินิมอลเหมือนในภาพตัวอย่าง
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                              <Film
                                className="w-8 h-8 opacity-80"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>

                        {/* Info Area */}
                        <div className="p-6 text-center bg-card relative z-10 flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">
                            {item.category || "Production"}
                          </span>
                          <h3 className="text-base font-bold text-[hsl(var(--ds-chocolate))] line-clamp-2">
                            {getLang(item.title_en, item.title_th)}
                          </h3>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              {/* ✅ Empty State */}
              {works.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-xl border border-border">
                  <Film className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "No works available yet."
                      : "ยังไม่มีผลงานในขณะนี้"}
                  </p>
                  {user && (
                    <Button asChild className="mt-4">
                      <Link to="/admin/production/add">
                        <Plus className="mr-2 h-4 w-4" /> Add First Work
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ===== SECTION 2: SERVICES (Static) ===== */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.createSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.create)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {services.map((service, idx) => {
                  const IconComponent = serviceIcons[service.key];
                  return (
                    <div
                      key={service.key}
                      className={`bg-card border border-border rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up stagger-${idx + 1}`}
                    >
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:from-primary/20 transition-colors">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-[hsl(var(--ds-chocolate))] mb-3">
                        {t(service.label)}
                      </h3>
                      <p className="text-foreground/70">
                        {t(service.description)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base bg-white/50 backdrop-blur-md border border-[hsl(var(--ds-red-orange))]/30 text-[hsl(var(--ds-chocolate))] hover:bg-[hsl(var(--ds-cream))] hover:text-primary transition-all duration-300 rounded-[20px] shadow-sm font-medium tracking-wide"
                >
                  {t(production.moreDetails)}
                </Button>
              </div>
            </div>
          </section>

          {/* ===== SECTION 3: BEHIND THE SCENES (Static) ===== */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.behindSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.behind)}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {behindScenes.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-6 group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
                  >
                    <Camera className="w-10 h-10 text-primary/50 group-hover:text-primary mb-4 transition-colors" />
                    <span className="text-base font-semibold text-[hsl(var(--ds-chocolate))] mb-1 text-center">
                      {t(item.placeholder)}
                    </span>
                    <span className="text-sm text-foreground/60 text-center">
                      {t(item.description)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== SECTION 4: OUR GEAR (Dynamic) ===== */}
          <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-primary/5 via-white to-[hsl(var(--ds-cream))]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.gearSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.gear)}
                </h2>
              </div>
              <div className="flex justify-end m-5">
                {/* 🔐 ปุ่ม Add Gear */}
                {user && (
                  <div className="text-center mt-4">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-dashed"
                    >
                      <Link to="/admin/gear/add">
                        <Plus className="mr-2 h-4 w-4" /> Add Gear
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {gear.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Wrench className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <h4 className="font-semibold text-[hsl(var(--ds-chocolate))] text-sm mb-1 line-clamp-1">
                        {getLang(item.name_en, item.name_th)}
                      </h4>
                      <span className="text-xs text-foreground/60 line-clamp-1">
                        {item.category}
                      </span>
                    </div>

                    {/* 🔐 Admin: Edit / Delete Gear */}
                    {user && (
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-6 w-6"
                          onClick={() =>
                            navigate(`/admin/gear/edit/${item.id}`)
                          }
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>

                        {/* ✅ AlertDialog แทน confirm() */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-6 w-6"
                              disabled={deletingGearId === item.id}
                            >
                              {deletingGearId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ยืนยันการลบ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                ลบ "{getLang(item.name_en, item.name_th)}" —
                                การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGear(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ✅ Empty State Gear */}
              {gear.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-xl border border-border mb-6">
                  <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "No gear listed yet."
                      : "ยังไม่มีอุปกรณ์ในขณะนี้"}
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base bg-white/50 backdrop-blur-md border border-[hsl(var(--ds-red-orange))]/30 text-[hsl(var(--ds-chocolate))] hover:bg-[hsl(var(--ds-cream))] hover:text-primary transition-all duration-300 rounded-[20px] shadow-sm font-medium tracking-wide"
                >
                  {t(production.viewAllGear)}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Production;
