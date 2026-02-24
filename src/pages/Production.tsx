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
          <h1 className="text-left sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
            {production.heroTitle}
          </h1>
          <p className="text-left sm:text-2xl text-[hsl(var(--ds-chocolate))]/80 font-medium mb-4">
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
              <div className="text-center mb-12">
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
                    <Button onClick={signOut} variant="destructive" size="sm">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map((item) => (
                  <a
                    key={item.id}
                    href={item.media_url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-video bg-black rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Background Image */}
                    <img
                      src={
                        item.thumbnail_url ||
                        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
                      }
                      alt={getLang(item.title_en, item.title_th)}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {/* Play/Image Icon */}
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 mb-4">
                        {item.media_type === "image" ? (
                          <ImageIcon className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </div>

                      {/* Title & Category */}
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-black/50 px-3 py-1 rounded-full mb-2 backdrop-blur-md">
                        {item.category || "Production"}
                      </span>
                      <h3 className="text-xl font-bold text-white text-center px-4 drop-shadow-md">
                        {getLang(item.title_en, item.title_th)}
                      </h3>
                      <p className="text-white/80 text-sm mt-1 line-clamp-1 px-6 text-center">
                        {getLang(
                          item.short_desc_en || "",
                          item.short_desc_th || "",
                        )}
                      </p>

                      {/* 🔐 Admin Overlay Buttons */}
                      {user && (
                        <div className="absolute top-2 right-2 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/admin/production/edit/${item.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>

                          {/* ✅ AlertDialog แทน confirm() */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
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
                                  onClick={() => handleDeleteWork(item.id)}
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
                  </a>
                ))}
              </div>

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
                {services.map((service) => {
                  const IconComponent = serviceIcons[service.key];
                  return (
                    <div
                      key={service.key}
                      className="bg-card border border-border rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl"
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
                {behindScenes.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-6 group cursor-pointer hover:shadow-lg transition-all"
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
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl"
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
