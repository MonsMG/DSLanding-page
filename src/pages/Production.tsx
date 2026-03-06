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
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
  const { works, gear, loading } = useProduction();

  // State สำหรับ delete (ป้องกัน double-click)
  const [deletingWorkId, setDeletingWorkId] = useState<number | null>(null);
  const [deletingGearId, setDeletingGearId] = useState<number | null>(null);
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

  const behindScenes = [
    { id: 1, ...production.behindScenes.onSet },
    { id: 2, ...production.behindScenes.teamMeeting },
    { id: 3, ...production.behindScenes.equipmentSetup },
    { id: 4, ...production.behindScenes.postProduction },
    { id: 5, ...production.behindScenes.locationScout },
    { id: 6, ...production.behindScenes.clientReview },
  ];

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
  // 2. ฟังก์ชันแปลงลิงก์ YouTube ธรรมดา ให้เป็นลิงก์สำหรับ Embed (พร้อมสั่งเล่นอัตโนมัติ)
  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url || url === "#") return null;
    // ✅ รองรับทั้ง youtube ปกติ, youtu.be และ youtube shorts
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    // ถ้าเจอ ID วิดีโอ (11 ตัวอักษร)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }

    // ❌ ถ้าไม่ใช่ลิงก์ YouTube ห้ามคืนค่า url ดิบกลับไป ให้คืน null เพื่อตัดไฟแต่ต้นลม
    return null; // ถ้าไม่ใช่ลิงก์ YouTube ให้คืนค่าเดิมกลับไป
  };
  // ==============================
  // 🖥️ Render
  // ==============================

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* ===== COVER SECTION ===== */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-left sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 animate-fade-in-up">
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
          <p className="text-left sm:text-2xl text-[hsl(var(--ds-chocolate))]/80 font-medium mb-4 animate-fade-in-up stagger-2">
            {t(production.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* ===== LOADING STATE ===== */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading production data...</p>
        </div>
      ) : (
        <>
          {/* ============================================================ */}
          {/* SECTION 1: OUR WORKS (Dynamic — Supabase, Slider)             */}
          {/* ============================================================ */}
          <section className="relative z-10 py-12 md:py-16 overflow-hidden max-w-full">
            <div className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-6">
              {/* Section Header */}
              <div className="text-center mb-6 md:mb-8 animate-fade-in-up">
                <span className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest">
                  {t(production.sections.workSubtitle)}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.work)}
                </h2>

                {/* 🔐 Admin: Add Work */}
                {user && (
                  <div className="flex gap-2 bg-white/80 p-2 rounded-lg border border-primary/20 shadow-lg w-fit mx-auto mt-4">
                    <Button asChild size="sm">
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
                  // เปลี่ยน gap ให้แคบลงนิดหน่อยเพราะเราไม่ให้มันทับกันแล้ว
                  className="relative w-full flex flex-col gap-4 md:gap-6"
                >
                  {/* 🖼️ Main Image (เอา shadow-2xl และ bg-background กรอบนอกออกทั้งหมด) */}
                  <div
                    className="w-full aspect-video lg:aspect-[21/9] relative group select-none cursor-pointer rounded-xl md:rounded-2xl overflow-hidden bg-black/5 z-10"
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
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                        key={`work-img-${activeWork.id}`}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-card/50">
                        <Film className="w-16 h-16 text-primary/50 mb-4" />
                      </div>
                    )}

                    {/* ▶️ Play button for video items → opens YouTube */}
                    {activeWork?.media_type === "video" &&
                      activeWork?.media_url && (
                        <button
                          type="button"
                          className="absolute inset-0 z-20 flex items-center justify-center outline-none group/play"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // กันไม่ให้ไปทับกับการคลิกเปลี่ยนรูป
                            setIsVideoModalOpen(true); // สั่งเปิด Pop-up
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

                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block drop-shadow-lg">
                        {activeWork?.category || "Production"}
                      </span>
                      <h3 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        {getLang(activeWork?.title_en, activeWork?.title_th)}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base drop-shadow-md line-clamp-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        {getLang(
                          activeWork?.short_desc_en,
                          activeWork?.short_desc_th,
                        )}
                      </p>
                    </div>

                    {/* 🔐 Admin: Edit / Delete */}
                    {user && (
                      <div className="absolute top-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(
                              `/admin/production/edit/${activeWork?.id}`,
                            );
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
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ยืนยันการลบ?</AlertDialogTitle>
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
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (activeWork)
                                    handleDeleteWork(activeWork.id);
                                }}
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

                  {/* 🎞️ Thumbnails Strip — Full-width (edge-to-edge) */}
                  {/* เปลี่ยนจาก -mt-12 เป็น mt-2 หรือ mt-4 และใส่ mb-12 เพื่อดัน Section ด้านล่าง */}
                  <div className="relative z-30 mt-2 md:mt-4 mb-8 md:mb-12 w-[100vw] -ml-[50vw] left-1/2 group/thumb">
                    <div className="relative py-3 px-2">
                      {/* ◀️ ปุ่มย้อนกลับ — floating overlay ด้านซ้าย */}
                      <button
                        onClick={goWorksPrev}
                        className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 outline-none shadow-md"
                        aria-label="Previous Work"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      {/* 🎞️ แถบรูปเล็ก (Thumbnails) — scroll container */}
                      <div
                        ref={worksThumbsContainerRef}
                        className="flex justify-center gap-2 md:gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-8 md:px-14 lg:px-16 py-1"
                      >
                        {works.map((item, idx) => (
                          <button
                            key={item.id}
                            ref={(el) => {
                              worksThumbRefs.current[idx] = el;
                            }}
                            onClick={() => setWorksIndex(idx)}
                            className={`relative flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-52 aspect-video rounded-xl overflow-hidden transition-all duration-500 outline-none ${
                              worksIndex === idx
                                ? "shadow-lg scale-100 opacity-100 z-10"
                                : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 scale-95 hover:scale-100"
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
                              <div className="w-full h-full bg-black/10 flex items-center justify-center">
                                <Film className="w-5 h-5 text-black/30" />
                              </div>
                            )}

                            {/* ไอคอน Video Overlay */}
                            {item.media_type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-3 h-3 text-[hsl(var(--ds-chocolate))] ml-0.5"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* ▶️ ปุ่มถัดไป — floating overlay ด้านขวา */}
                      <button
                        onClick={goWorksNext}
                        className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 outline-none shadow-md"
                        aria-label="Next Work"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State — Works */
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

          {/* ============================================================ */}
          {/* SECTION 2: BEHIND THE SCENES (Static — Slider/Carousel)      */}
          {/* ============================================================ */}
          <section className="relative z-10 py-12 md:py-16 overflow-hidden">
            {/* 🌟 กรอบครอบพื้นหลังที่ทำหน้าที่ Fade (Mask) ขอบบนและล่างให้กลืนกับเว็บ */}
            <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
              {/* รูปเบลอ */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110 transition-all duration-1000 ease-in-out b"
                style={{
                  backgroundImage: activeItem?.image_url
                    ? `url(${activeItem.image_url})`
                    : "none",
                  backgroundColor: "hsl(var(--ds-chocolate) / 0.1)",
                }}
              />
              {/* แผ่นฟิล์มบางๆ */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
            </div>

            {/* Content Container (โค้ดส่วนนี้คือ Slider ) */}
            <div className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-6 ">
              {/* Section Header */}
              <div className="text-center mb-6 md:mb-8">
                <span className="text-sm font-bold text-primary mb-2 block uppercase tracking-widest drop-shadow-sm">
                  {t(production.sections.behindSubtitle)}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--ds-chocolate))] drop-shadow-md">
                  {t(production.sections.behind)}
                </h2>
              </div>

              {/* Slider Container */}
              <div
                ref={sliderRef}
                className="relative w-full flex flex-col gap-4 md:gap-6"
              >
                {/* �️ Main Image (เอา frame นอกออก ให้ตรงกับ OUR WORK) */}
                <div
                  className="w-full aspect-video lg:aspect-[21/9] relative group select-none cursor-pointer rounded-xl md:rounded-2xl overflow-hidden bg-black/5 z-10"
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
                      alt={t(activeItem.placeholder)}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                      key={activeItem.id}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Camera className="w-16 h-16 text-primary/50 mb-4" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none">
                    <h3 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {t(activeItem?.placeholder)}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base drop-shadow-md line-clamp-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {t(activeItem?.description)}
                    </p>
                  </div>
                </div>

                {/* 🎞️ Thumbnails Strip — Full-width (edge-to-edge) ตรงกับ OUR WORK */}
                <div className="relative z-30 mt-2 md:mt-4 mb-8 md:mb-12 w-[100vw] -ml-[50vw] left-1/2 group/thumb">
                  <div className="relative py-3 px-2">
                    {/* ◀️ ปุ่มย้อนกลับ — floating overlay */}
                    <button
                      onClick={goPrev}
                      className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 outline-none shadow-md"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* 🎞️ แถบรูปเล็ก (Thumbnails) — scroll container */}
                    <div
                      ref={behindThumbsContainerRef}
                      className="flex justify-center gap-2 md:gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-8 md:px-14 lg:px-16 py-1"
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
                          className={`relative flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-52 aspect-video rounded-xl overflow-hidden transition-all duration-500 outline-none ${
                            activeIndex === idx
                              ? "shadow-lg scale-100 opacity-100 z-10"
                              : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 scale-95 hover:scale-100"
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
                            <div className="w-full h-full bg-black/20 flex items-center justify-center">
                              <Camera className="w-4 h-4 text-white/60" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* ▶️ ปุ่มถัดไป — floating overlay */}
                    <button
                      onClick={goNext}
                      className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 outline-none shadow-md"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* ============================================================ */}
          {/* SECTION 3: SERVICES (Static)                                 */}
          {/* ============================================================ */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.createSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.create)}
                </h2>
              </div>

              {/* Service Cards */}
              {/* เปลี่ยนจาก h-[500px] แบบฟิกซ์ตายตัว เป็น min-h-[450px] เพื่อกันข้อความล้นเวลาดูในจอมือถือ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10 min-h-[450px]">
                {services.map((service, idx) => {
                  const IconComponent = serviceIcons[service.key];
                  return (
                    <div
                      key={service.key}
                      // 1. เพิ่ม flex และ flex-col เข้าไปที่ตัวการ์ดหลัก
                      className={`flex flex-col bg-card border border-border rounded-3xl p-8 lg:p-10 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up stagger-${idx + 1}`}
                    >
                      {/* 🔝 ส่วนบน: Icon และ หัวข้อ (จัดชิดซ้าย) */}
                      <div>
                        {/* เอา mx-auto ออกเพื่อให้ Icon ชิดซ้าย และปรับขนาดให้เล็กลงนิดนึงดูมินิมอลขึ้น */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:from-primary/20 transition-colors">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 text-left">
                          {t(service.label)}
                        </h3>
                      </div>

                      {/* 🔽 ส่วนล่าง: คำอธิบาย */}
                      {/* 2. พระเอกคือ mt-auto (margin-top: auto) มันจะดันตัวเองลงไปอยู่ล่างสุดของการ์ดเสมอ */}
                      <div className="mt-auto pt-10">
                        <p className="text-foreground/70 text-left leading-relaxed">
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
          {/* SECTION 4: OUR GEAR (Dynamic — Supabase)                     */}
          {/* ============================================================ */}
          <section className="relative z-10 py-20 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-10">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(production.sections.gearSubtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(production.sections.gear)}
                </h2>
              </div>

              {/* 🔐 Admin: Add Gear */}
              {user && (
                <div className="flex justify-center mb-8">
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

              {/* Gear Cards (max 5) — Image on top, details fade below */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-10 max-w-6xl mx-auto">
                {gear.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedGear(item)}
                  >
                    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-square w-full bg-gradient-to-br from-primary/5 to-[hsl(var(--ds-cream))] overflow-hidden relative [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={getLang(item.name_en, item.name_th)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Wrench className="w-10 h-10 text-primary/40" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-4 flex flex-col gap-1">
                        <h4 className="font-semibold text-[hsl(var(--ds-chocolate))] text-sm line-clamp-1">
                          {getLang(item.name_en, item.name_th)}
                        </h4>
                        <span className="text-xs text-foreground/60 line-clamp-1">
                          {item.brand ? `${item.brand}` : item.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full w-fit ${
                            item.available !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
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
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-6 w-6 bg-white/90 hover:bg-white shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/gear/edit/${item.id}`);
                          }}
                        >
                          <Pencil className="h-3 w-3 text-primary" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-6 w-6 shadow-sm"
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

              {/* Empty State — Gear */}
              {gear.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-xl border border-border mb-6 max-w-2xl mx-auto">
                  <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "No gear listed yet."
                      : "ยังไม่มีอุปกรณ์ในขณะนี้"}
                  </p>
                </div>
              )}

              {/* View All Gear Button */}
              <div className="text-center">
                <Link to="/production/gear">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-base bg-white/50 backdrop-blur-md border border-[hsl(var(--ds-red-orange))]/30 text-[hsl(var(--ds-chocolate))] hover:bg-[hsl(var(--ds-cream))] hover:text-primary transition-all duration-300 rounded-[20px] shadow-sm font-medium tracking-wide"
                  >
                    {t(production.viewAllGear)}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          {isVideoModalOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6 md:p-12 animate-in fade-in duration-300"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <div
                className="w-full max-w-6xl aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative"
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
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-300"
              onClick={() => setSelectedGear(null)}
            >
              <div
                className="relative w-full max-w-4xl h-[85vh] md:h-[600px] bg-card rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ปุ่มปิด */}
                <button
                  onClick={() => setSelectedGear(null)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 md:w-10 md:h-10 bg-white/50 hover:bg-white/90 rounded-full flex items-center justify-center text-foreground hover:text-black transition-colors shadow-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* ด้านซ้าย (รูปภาพ) */}
                <div className="w-full md:w-1/2 md:aspect-auto aspect-square bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden group/modalimg">
                  {selectedGear.image_url ? (
                    <img
                      src={selectedGear.image_url}
                      alt={getLang(selectedGear.name_en, selectedGear.name_th)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/modalimg:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="w-20 h-20 text-primary/30 group-hover/modalimg:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  {/* Gradient Fade ทางด้านขวา (เฉพาะ Desktop) เพื่อนำสายตา */}
                  <div className="hidden md:block absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none"></div>
                  {/* Gradient Fade ทางด้านล่าง (เฉพาะ Mobile) */}
                  <div className="block md:hidden absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* ด้านขวา (รายละเอียด) */}
                <div className="w-full md:w-1/2 p-6 justify-center md:p-10 lg:p-12 flex flex-col relative z-20">
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 scrollbar-track-transparent">
                    {/* Badge ประเภทอุปกรณ์ */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {selectedGear.category}
                      </span>
                      {selectedGear.brand && (
                        <span className="text-xs font-semibold text-white bg-orange-500/90 px-3 py-1 rounded-full border border-border">
                          {selectedGear.brand}
                        </span>
                      )}
                    </div>

                    {/* ชื่ออุปกรณ์ */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-2 leading-tight">
                      {getLang(selectedGear.name_en, selectedGear.name_th)}
                    </h3>

                    {/* สถานะความพร้อม */}
                    <div className="mb-6">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                          selectedGear.available !== false
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-600 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            selectedGear.available !== false
                              ? "bg-green-500 animate-pulse"
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

                    <div className="w-12 h-1 bg-primary/20 rounded-full mb-6"></div>

                    {/* รายละเอียด */}
                    {(selectedGear.short_desc_en ||
                      selectedGear.short_desc_th) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wide">
                          {language === "en" ? "Description" : "รายละเอียด"}
                        </h4>
                        <p className="text-foreground/70 leading-relaxed text-sm lg:text-base">
                          {getLang(
                            selectedGear.short_desc_en,
                            selectedGear.short_desc_th,
                          )}
                        </p>
                      </div>
                    )}

                    {/* สเปค หรือ ข้อมูลเพิ่มเติม (ถ้ามี) */}
                    {(selectedGear.full_desc_en ||
                      selectedGear.full_desc_th) && (
                      <div className="mb-6 bg-secondary/50 p-4 rounded-xl border border-secondary">
                        <h4 className="flex items-center text-sm font-bold text-foreground/90 mb-2">
                          <Wrench className="w-4 h-4 mr-2 text-primary" />
                          {language === "en"
                            ? "Specifications"
                            : "ข้อมูลจำเพาะ"}
                        </h4>
                        <p className="text-foreground/70 text-sm whitespace-pre-line leading-relaxed">
                          {getLang(
                            selectedGear.full_desc_en,
                            selectedGear.full_desc_th,
                          )}
                        </p>
                      </div>
                    )}

                    {selectedGear.specs && (
                      <div className="mb-6 bg-secondary/50 p-4 rounded-xl border border-secondary">
                        <h4 className="flex items-center text-sm font-bold text-foreground/90 mb-2">
                          <Wrench className="w-4 h-4 mr-2 text-primary" />
                          {language === "en"
                            ? "Specifications"
                            : "ข้อมูลจำเพาะ"}
                        </h4>
                        <p className="text-foreground/70 text-sm whitespace-pre-line leading-relaxed">
                          {selectedGear.specs}
                        </p>
                      </div>
                    )}

                    {/* ราคาเช่า (ถ้ามี) */}
                    {selectedGear.rental_price && (
                      <div className="mt-8 flex items-end gap-2">
                        <span className="text-3xl font-bold text-primary">
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
