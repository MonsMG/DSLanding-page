/**
 * 🎬 Production.tsx — หน้าแสดงผลงาน Production + อุปกรณ์ + บริการ
 *
 * แบ่งเป็น 4 sections:
 *   1. Our Works — ดึงจาก Supabase (dynamic)
 *   2. Behind the Scenes — Slider/Carousel (static data)
 *   3. Services — ข้อมูล static
 *   - Delete ใช้ AlertDialog ยืนยัน
 */

import type { ProductionGear } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Film,
  Scissors,
  Video,
  Loader2,
  Wrench,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import { useProduction } from "@/hooks/useProduction";
import { useBehindScenes } from "@/hooks/useBehindScenes";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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

// ==============================
// 🎯 Constants
// ==============================

const serviceIcons: Record<string, LucideIcon> = {
  video: Video,
  photography: Camera,
  editing: Scissors,
};

// ==============================
// 🎬 Production Component
// ==============================

const Production = () => {
  const { t, language } = useLanguage();
  const { production } = contentData;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ดึงข้อมูลจริงจาก Supabase
  const { works: allWorks, gear, loading } = useProduction();
  const { behindScenes: allBehindScenes, refetch: refetchBehindScenes } =
    useBehindScenes();

  // 🎠 แสดงใน showcase แค่ 10 รายการแรกต่อ section (สไตล์ key.visualarts.gr.jp)
  // — ข้อมูลทั้งหมดยังอยู่ใน DB ครบ แค่จำกัดจำนวนที่โชว์บนหน้านี้
  const MAX_SHOWCASE_ITEMS = 10;
  const works = allWorks.slice(0, MAX_SHOWCASE_ITEMS);
  const behindScenes = allBehindScenes.slice(0, MAX_SHOWCASE_ITEMS);

  // State สำหรับ delete (ป้องกัน double-click)
  const [deletingWorkId, setDeletingWorkId] = useState<number | null>(null);
  const [deletingGearId, setDeletingGearId] = useState<number | null>(null);
  const [deletingBehindId, setDeletingBehindId] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState<ProductionGear | null>(null);

  // State สำหรับ Behind the Scenes Slider
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // State สำหรับ Our Works Slider
  const [worksIndex, setWorksIndex] = useState(0);
  const [worksIsPaused, setWorksIsPaused] = useState(false);
  const worksSliderRef = useRef<HTMLDivElement>(null);
  const worksTouchStartX = useRef<number>(0);
  const worksTouchEndX = useRef<number>(0);

  // Refs สำหรับ scroll-to-center ของ thumbnail strip
  const worksThumbsContainerRef = useRef<HTMLDivElement>(null);
  const worksThumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Refs สำหรับ scroll-to-center ของ Behind the Scenes thumbnail strip
  const behindThumbsContainerRef = useRef<HTMLDivElement>(null);
  const behindThumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ==============================
  // 📦 Static Data
  // ==============================

  const services = [
    { key: "video", ...production.services.video },
    { key: "photography", ...production.services.photography },
    { key: "editing", ...production.services.editing },
  ];

  // behindScenes มาจาก useBehindScenes() hook แล้ว — ไม่ต้องสร้าง static array

  // ==============================
  // 🔧 Helper Functions
  // ==============================

  /** เลือกข้อความตามภาษาปัจจุบัน */
  const getLang = (en: string | undefined, th: string | undefined) => {
    return language === "en" ? en || th || "" : th || en || "";
  };

  // ==============================
  // 🎞️ Behind the Scenes Slider Logic
  // ==============================

  /** ไปรูปถัดไป */
  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % behindScenes.length);
    setIsPaused(true);
  }, [behindScenes.length]);

  /** ไปรูปก่อนหน้า */
  const goPrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + behindScenes.length) % behindScenes.length,
    );
    setIsPaused(true);
  }, [behindScenes.length]);

  /** จัดการ touch swipe — เรียกตอน touchEnd */
  const handleSwipeEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const MIN_SWIPE = 50; // ต้อง swipe อย่างน้อย 50px
    if (diff > MIN_SWIPE) goNext();
    else if (diff < -MIN_SWIPE) goPrev();
  }, [goNext, goPrev]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    // IntersectionObserver: เช็คว่า Slider ยังอยู่บนหน้าจอไหม
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsPaused(false);
        }
      },
      { threshold: 0.1 },
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    // Auto-play: เปลี่ยนรูปทุก 4 วินาที (ถ้าไม่ได้กดหยุด)
    if (!isPaused && behindScenes.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % behindScenes.length);
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isPaused, behindScenes.length]);

  const activeItem = behindScenes[activeIndex];

  // ==============================
  // 🎬 Our Works Slider Logic
  // ==============================

  const goWorksNext = useCallback(() => {
    if (works.length === 0) return;
    setWorksIndex((prev) => (prev + 1) % works.length);
    setWorksIsPaused(true);
  }, [works.length]);

  const goWorksPrev = useCallback(() => {
    if (works.length === 0) return;
    setWorksIndex((prev) => (prev - 1 + works.length) % works.length);
    setWorksIsPaused(true);
  }, [works.length]);

  const handleWorksSwipeEnd = useCallback(() => {
    const diff = worksTouchStartX.current - worksTouchEndX.current;
    const MIN_SWIPE = 50;
    if (diff > MIN_SWIPE) goWorksNext();
    else if (diff < -MIN_SWIPE) goWorksPrev();
  }, [goWorksNext, goWorksPrev]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setWorksIsPaused(false);
      },
      { threshold: 0.1 },
    );

    if (worksSliderRef.current) observer.observe(worksSliderRef.current);

    if (!worksIsPaused && works.length > 0) {
      interval = setInterval(() => {
        setWorksIndex((prev) => (prev + 1) % works.length);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [worksIsPaused, works.length]);

  const activeWork = works.length > 0 ? works[worksIndex] : null;

  // ==============================
  // 🗑️ Delete Handlers
  // ==============================

  const handleDeleteWork = async (id: number) => {
    setDeletingWorkId(id);
    try {
      const { error } = await supabase
        .from("production_works")
        .delete()
        .eq("id", id);

      if (error) {
        const isPermission =
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission");
        toast({
          variant: "destructive",
          title: isPermission ? "Unauthorized" : "Error",
          description: isPermission
            ? "You do not have permission."
            : "Failed to delete. Please try again.",
        });
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

  const handleDeleteGear = async (id: number) => {
    setDeletingGearId(id);
    try {
      const { error } = await supabase
        .from("production_gear")
        .delete()
        .eq("id", id);

      if (error) {
        const isPermission =
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission");
        toast({
          variant: "destructive",
          title: isPermission ? "Unauthorized" : "Error",
          description: isPermission
            ? "You do not have permission."
            : "Failed to delete. Please try again.",
        });
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

  // ==============================
  // 🗑️ Delete: Behind the Scenes
  // ==============================
  const handleDeleteBehindScene = async (id: number) => {
    setDeletingBehindId(id);
    try {
      const { error } = await supabase
        .from("production_behind_scenes")
        .delete()
        .eq("id", id);

      if (error) {
        const isPermission =
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission");
        toast({
          variant: "destructive",
          title: isPermission ? "Unauthorized" : "Error",
          description: isPermission
            ? "You do not have permission."
            : "Failed to delete. Please try again.",
        });
        return;
      }
      toast({
        title: "Deleted",
        description: "Behind the Scenes deleted successfully.",
      });
      refetchBehindScenes();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setDeletingBehindId(null);
    }
  };

  // 2. ฟังก์ชันแปลงลิงก์ YouTube ธรรมดา ให้เป็นลิงก์สำหรับ Embed (พร้อมสั่งเล่นอัตโนมัติ)
  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url || url === "#") return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }

    return null;
  };

  // ==============================
  // 🖥️ Render
  // ==============================

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* ===== COVER SECTION ===== */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Graphic ลูกเล่นแสงสีแบบเบาๆ */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-left sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 animate-fade-in-up tracking-tight">
            {production.heroTitle && production.heroTitle.length >= 2 ? (
              <>
                {production.heroTitle.charAt(0)}
                <span className="text-primary mr-5">
                  {production.heroTitle.charAt(1)}
                </span>
                {production.heroTitle.slice(2)}
              </>
            ) : (
              production.heroTitle
            )}
          </h1>
          <p className="text-left sm:text-2xl text-[hsl(var(--ds-chocolate))]/70 font-medium mb-4 animate-fade-in-up stagger-2 max-w-3xl">
            {t(production.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* ===== LOADING STATE ===== */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50 mb-4" />
          <p className="text-muted-foreground font-medium">
            Loading production data...
          </p>
        </div>
      ) : (
        <>
          {/* ============================================================ */}
          {/* SECTION 1: OUR WORKS (Dynamic)                               */}
          {/* ============================================================ */}
          <section className="relative z-10 py-12 md:py-16 overflow-hidden max-w-full">
            <div className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-10 animate-fade-in-up">
                <span className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest">
                  {t(production.sections.workSubtitle)}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.work)}
                </h2>

                {/* 🔐 Admin: Add Work */}
                {user && (
                  <div className="flex justify-center mt-6">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full px-6 shadow-sm"
                    >
                      <Link to="/admin/production/add">
                        <Plus className="mr-2 h-4 w-4" /> Add Work
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {works.length > 0 ? (
                <div
                  ref={worksSliderRef}
                  className="relative w-full flex flex-col gap-6 md:gap-8"
                >
                  {/* 🖼️ Main Image */}
                  <div
                    className="w-full aspect-video lg:aspect-[21/9] relative group select-none cursor-pointer rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 border-0"
                    onTouchStart={(e) => {
                      worksTouchStartX.current = e.changedTouches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      worksTouchEndX.current = e.changedTouches[0].clientX;
                      handleWorksSwipeEnd();
                    }}
                  >
                    {activeWork?.thumbnail_url ? (
                      <img
                        src={activeWork.thumbnail_url}
                        alt={getLang(activeWork.title_en, activeWork.title_th)}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        key={`work-img-${activeWork.id}`}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                        <Film className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      </div>
                    )}

                    {/* ▶️ Play button for video items */}
                    {activeWork?.media_type === "video" &&
                      activeWork?.media_url && (
                        <button
                          type="button"
                          className="absolute inset-0 z-20 flex items-center justify-center outline-none group/play bg-black/10 group-hover:bg-black/20 transition-colors duration-500"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsVideoModalOpen(true);
                          }}
                        >
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl group-hover/play:scale-110 transition-transform duration-300">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-7 h-7 md:w-9 md:h-9 text-primary ml-1"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </button>
                      )}

                    {/* Text overlay - Gradient นุ่มขึ้น */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block drop-shadow-lg">
                        {activeWork?.category || "Production"}
                      </span>
                      <h3 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {getLang(activeWork?.title_en, activeWork?.title_th)}
                      </h3>
                      <p className="text-white/80 text-sm md:text-lg drop-shadow-md line-clamp-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 max-w-3xl font-light">
                        {getLang(
                          activeWork?.short_desc_en,
                          activeWork?.short_desc_th,
                        )}
                      </p>
                    </div>

                    {/* 🔐 Admin: Edit / Delete */}
                    {user && (
                      <div className="absolute top-6 right-6 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-primary shadow-sm rounded-full"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(
                              `/admin/production/edit/${activeWork?.id}`,
                            );
                          }}
                        >
                          <Pencil className="h-4 w-4 text-orange-950" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-10 w-10 shadow-sm rounded-full"
                              disabled={deletingWorkId === activeWork?.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              {deletingWorkId === activeWork?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[hsl(var(--ds-chocolate))]">
                                ยืนยันการลบ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                ลบ "
                                {getLang(
                                  activeWork?.title_en,
                                  activeWork?.title_th,
                                )}
                                " — การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (activeWork)
                                    handleDeleteWork(activeWork.id);
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  {/* 🎞️ Thumbnails Strip */}
                  <div className="relative z-30 mt-2 mb-12 w-[100vw] -ml-[50vw] left-1/2 group/thumb">
                    <div className="relative py-4 px-2">
                      <button
                        onClick={goWorksPrev}
                        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[hsl(var(--ds-chocolate))] opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 outline-none shadow-lg border border-border/50"
                        aria-label="Previous Work"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      <div
                        ref={worksThumbsContainerRef}
                        className="flex justify-center gap-3 md:gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-8 md:px-14 lg:px-20 py-2"
                      >
                        {works.map((item, idx) => (
                          <button
                            key={item.id}
                            ref={(el) => {
                              worksThumbRefs.current[idx] = el;
                            }}
                            onClick={() => setWorksIndex(idx)}
                            className={`relative flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 aspect-video rounded-xl overflow-hidden transition-all duration-500 outline-none ${
                              worksIndex === idx
                                ? "shadow-[0_8px_20px_rgb(0,0,0,0.15)] scale-105 opacity-100 z-10 border-2 border-primary"
                                : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0 scale-95 hover:scale-100 shadow-sm"
                            }`}
                          >
                            {item.thumbnail_url ? (
                              <img
                                src={item.thumbnail_url}
                                alt={getLang(item.title_en, item.title_th)}
                                className="w-full h-full object-cover"
                                draggable={false}
                              />
                            ) : (
                              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                                <Film className="w-6 h-6 text-muted-foreground/40" />
                              </div>
                            )}

                            {item.media_type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 text-[hsl(var(--ds-chocolate))] ml-0.5"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={goWorksNext}
                        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[hsl(var(--ds-chocolate))] opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 outline-none shadow-lg border border-border/50"
                        aria-label="Next Work"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State — Works */
                <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-0 shadow-sm max-w-2xl mx-auto">
                  <Film className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium text-lg">
                    {language === "en"
                      ? "No works available yet."
                      : "ยังไม่มีผลงานในขณะนี้"}
                  </p>
                  {user && (
                    <Button
                      asChild
                      className="mt-6 rounded-full px-6 shadow-md"
                    >
                      <Link to="/admin/production/add">
                        <Plus className="mr-2 h-4 w-4" /> Add First Work
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: BEHIND THE SCENES                                 */}
          {/* ============================================================ */}
          <section className="relative z-10 py-12 md:py-16 overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110 transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: activeItem?.image_url
                    ? `url(${activeItem.image_url})`
                    : "none",
                  backgroundColor: "hsl(var(--ds-chocolate) / 0.05)",
                }}
              />
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-6">
              <div className="text-center mb-10 animate-fade-in-up">
                <span className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest drop-shadow-sm">
                  {t(production.sections.behindSubtitle)}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--ds-chocolate))] drop-shadow-sm">
                  {t(production.sections.behind)}
                </h2>

                {/* 🔐 Admin: Add Behind the Scenes */}
                {user && (
                  <div className="flex justify-center mt-6">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full px-6 shadow-sm"
                    >
                      <Link to="/admin/behind-scenes/add">
                        <Plus className="mr-2 h-4 w-4" />
                        {language === "en"
                          ? "Add Behind the Scenes"
                          : "เพิ่มเบื้องหลัง"}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div
                ref={sliderRef}
                className="relative w-full flex flex-col gap-6 md:gap-8"
              >
                {/* 🖼️ Main Image */}
                <div
                  className="w-full aspect-video lg:aspect-[21/9] relative group select-none cursor-pointer rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 border-0"
                  onTouchStart={(e) => {
                    touchStartX.current = e.changedTouches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    touchEndX.current = e.changedTouches[0].clientX;
                    handleSwipeEnd();
                  }}
                >
                  {activeItem?.image_url ? (
                    <img
                      src={activeItem.image_url}
                      alt={getLang(activeItem.title_en, activeItem.title_th)}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      key={activeItem.id}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                      <Camera className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none">
                    <h3 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {getLang(activeItem?.title_en, activeItem?.title_th)}
                    </h3>
                    <p className="text-white/80 text-sm md:text-lg drop-shadow-md line-clamp-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 max-w-3xl font-light">
                      {getLang(
                        activeItem?.description_en,
                        activeItem?.description_th,
                      )}
                    </p>
                  </div>

                  {/* 🔐 Admin: Edit / Delete (Hover to show) */}
                  {user && (
                    <div className="absolute top-6 right-6 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-primary shadow-sm rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(
                            `/admin/behind-scenes/edit/${activeItem?.id}`,
                          );
                        }}
                      >
                        <Pencil className="h-4 w-4 text-orange-950" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-10 w-10 shadow-sm rounded-full"
                            disabled={deletingBehindId === activeItem?.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            {deletingBehindId === activeItem?.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[hsl(var(--ds-chocolate))]">
                              ยืนยันการลบ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              ลบ "{activeItem?.title_en || activeItem?.title_th}
                              " — การลบจะไม่สามารถกู้คืนได้
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();
                                if (activeItem)
                                  handleDeleteBehindScene(activeItem.id);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>

                {/* 🎞️ Thumbnails Strip */}
                <div className="relative z-30 mt-2 mb-12 w-[100vw] -ml-[50vw] left-1/2 group/thumb">
                  <div className="relative py-4 px-2">
                    <button
                      onClick={goPrev}
                      className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[hsl(var(--ds-chocolate))] opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 outline-none shadow-lg border border-border/50"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div
                      ref={behindThumbsContainerRef}
                      className="flex justify-center gap-3 md:gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-8 md:px-14 lg:px-20 py-2"
                    >
                      {behindScenes.map((item, idx) => (
                        <button
                          key={item.id}
                          ref={(el) => {
                            behindThumbRefs.current[idx] = el;
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex(idx);
                            setIsPaused(true);
                          }}
                          className={`relative flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 aspect-video rounded-xl overflow-hidden transition-all duration-500 outline-none ${
                            activeIndex === idx
                              ? "shadow-[0_8px_20px_rgb(0,0,0,0.15)] scale-105 opacity-100 z-10 border-2 border-primary"
                              : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0 scale-95 hover:scale-100 shadow-sm"
                          }`}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                              <Camera className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={goNext}
                      className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[hsl(var(--ds-chocolate))] opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 outline-none shadow-lg border border-border/50"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: SERVICES                                          */}
          {/* ============================================================ */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.createSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
                  {t(production.sections.create)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 min-h-[450px]">
                {services.map((service, idx) => {
                  const IconComponent = serviceIcons[service.key];
                  return (
                    <div
                      key={service.key}
                      // 🎨 Card ไร้ขอบ + เงาพรีเมียม
                      className={`flex flex-col bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] p-8 lg:p-10 group hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 animate-fade-in-up stagger-${idx + 1}`}
                    >
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                          <IconComponent className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--ds-chocolate))] mb-3 text-left">
                          {t(service.label)}
                        </h3>
                      </div>
                      <div className="mt-auto pt-8">
                        <p className="text-foreground/70 text-left leading-relaxed font-light">
                          {t(service.description)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4: OUR GEAR                                          */}
          {/* ============================================================ */}
          <section className="relative z-10 py-20 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.gearSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
                  {t(production.sections.gear)}
                </h2>
              </div>

              {user && (
                <div className="flex justify-center mb-10">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-6 shadow-sm"
                  >
                    <Link to="/admin/gear/add">
                      <Plus className="mr-2 h-4 w-4" /> Add Gear
                    </Link>
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12 max-w-6xl mx-auto">
                {gear.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedGear(item)}
                  >
                    {/* 🎨 Card แบบไร้ขอบ + เงา */}
                    <div className="bg-white border-0 shadow-[0_2px_10px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgb(222,49,99,0.1)] transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                      <div className="aspect-square w-full bg-gradient-to-br from-primary/5 to-muted/30 overflow-hidden relative [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={getLang(item.name_en, item.name_th)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Wrench className="w-10 h-10 text-primary/20" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 md:p-5 flex flex-col gap-1.5 bg-white">
                        <h4 className="font-bold text-[hsl(var(--ds-chocolate))] text-sm line-clamp-1 leading-tight">
                          {getLang(item.name_en, item.name_th)}
                        </h4>
                        <span className="text-xs text-muted-foreground line-clamp-1 font-light">
                          {item.brand ? `${item.brand}` : item.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold mt-2 px-2.5 py-0.5 rounded-md w-fit border-none ${
                            item.available !== false
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {item.available !== false
                            ? language === "en"
                              ? "Available"
                              : "พร้อมใช้"
                            : language === "en"
                              ? "Unavailable"
                              : "ไม่ว่าง"}
                        </span>
                      </div>
                    </div>

                    {/* 🔐 Admin: Edit / Delete Gear */}
                    {user && (
                      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-primary shadow-sm rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/gear/edit/${item.id}`);
                          }}
                        >
                          <Pencil className="h-3 w-3 text-orange-950" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-7 w-7 shadow-sm rounded-md"
                              disabled={deletingGearId === item.id}
                            >
                              {deletingGearId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[hsl(var(--ds-chocolate))]">
                                ยืนยันการลบ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                ลบ "{getLang(item.name_en, item.name_th)}" —
                                การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGear(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
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

              {gear.length === 0 && (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-0 shadow-sm mb-10 max-w-2xl mx-auto">
                  <Wrench className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium text-lg">
                    {language === "en"
                      ? "No gear listed yet."
                      : "ยังไม่มีอุปกรณ์ในขณะนี้"}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <Link to="/production/gear">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 text-base bg-white/50 backdrop-blur-md border border-border/60 text-[hsl(var(--ds-chocolate))] hover:bg-white hover:border-[hsl(var(--ds-red-orange))]/50 hover:text-[hsl(var(--ds-red-orange))] transition-all duration-300 rounded-full shadow-sm hover:shadow-md font-medium"
                  >
                    {t(production.viewAllGear)}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* VIDEO MODAL POPUP                                            */}
          {/* ============================================================ */}
          {isVideoModalOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 md:p-12 animate-in fade-in duration-300"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <div
                className="w-full max-w-6xl aspect-video bg-black rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={getYouTubeEmbedUrl(activeWork?.media_url)}
                  title="YouTube video player"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GEAR MODAL POPUP                                             */}
          {/* ============================================================ */}
          {selectedGear && (
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300"
              onClick={() => setSelectedGear(null)}
            >
              <div
                className="relative w-full max-w-4xl h-[85vh] md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedGear(null)}
                  className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-[hsl(var(--ds-chocolate))] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* ด้านซ้าย (รูปภาพ) */}
                <div className="w-full md:w-1/2 md:aspect-auto aspect-square bg-muted/20 relative overflow-hidden group/modalimg">
                  {selectedGear.image_url ? (
                    <img
                      src={selectedGear.image_url}
                      alt={getLang(selectedGear.name_en, selectedGear.name_th)}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/modalimg:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="w-20 h-20 text-muted-foreground/20 group-hover/modalimg:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  {/* Fade mask ให้เนียนเข้าฝั่งขวา */}
                  <div className="hidden md:block absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="block md:hidden absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* ด้านขวา (รายละเอียด) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative z-20 bg-white">
                  <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 scrollbar-track-transparent">
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full border-none">
                        {selectedGear.category}
                      </span>
                      {selectedGear.brand && (
                        <span className="text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded-full border-none uppercase tracking-widest">
                          {selectedGear.brand}
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-4 leading-tight tracking-tight">
                      {getLang(selectedGear.name_en, selectedGear.name_th)}
                    </h3>

                    <div className="mb-8">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border-none shadow-sm ${
                          selectedGear.available !== false
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 shadow-sm ${
                            selectedGear.available !== false
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {selectedGear.available !== false
                          ? language === "en"
                            ? "Available in Stock"
                            : "พร้อมใช้งาน"
                          : language === "en"
                            ? "Currently Unavailable"
                            : "ไม่พร้อมใช้งาน"}
                      </span>
                    </div>

                    <div className="w-12 h-1 bg-border rounded-full mb-8"></div>

                    {(selectedGear.short_desc_en ||
                      selectedGear.short_desc_th) && (
                      <div className="mb-8">
                        <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">
                          {language === "en" ? "Description" : "รายละเอียด"}
                        </h4>
                        <p className="text-[hsl(var(--ds-chocolate))]/70 leading-relaxed font-light text-base">
                          {getLang(
                            selectedGear.short_desc_en,
                            selectedGear.short_desc_th,
                          )}
                        </p>
                      </div>
                    )}

                    {(selectedGear.full_desc_en ||
                      selectedGear.full_desc_th ||
                      selectedGear.specs) && (
                      <div className="mb-8 bg-muted/30 p-6 rounded-2xl border-none">
                        <h4 className="flex items-center text-sm font-bold text-[hsl(var(--ds-chocolate))] mb-3">
                          <Wrench className="w-4 h-4 mr-2 text-primary" />
                          {language === "en"
                            ? "Specifications"
                            : "ข้อมูลจำเพาะ"}
                        </h4>
                        <p className="text-[hsl(var(--ds-chocolate))]/70 text-sm whitespace-pre-line leading-relaxed font-light">
                          {getLang(
                            selectedGear.full_desc_en,
                            selectedGear.full_desc_th,
                          ) || selectedGear.specs}
                        </p>
                      </div>
                    )}

                    {selectedGear.rental_price && (
                      <div className="mt-8 flex items-baseline gap-2 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <span className="text-sm font-semibold text-muted-foreground mb-1 mr-2">
                          Rate:
                        </span>
                        <span className="text-4xl font-bold text-primary tracking-tight">
                          ฿{selectedGear.rental_price.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-foreground/50 pb-1">
                          / {language === "en" ? "day" : "วัน"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Production;
