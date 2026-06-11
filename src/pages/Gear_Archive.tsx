/**
 * 📂 GearArchive.tsx — คลังอุปกรณ์โปรดักชั่นทั้งหมด
 *
 * ดึงข้อมูลจาก Supabase ผ่าน useProductionGear hook
 * รองรับ: Filter ตาม category, Loading/Error states, Admin CRUD
 */

import { useState, useMemo } from "react";
import { Loader2, Wrench, Pencil, Trash2, Plus } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { contentData } from "@/data/content";
import { useProductionGear } from "@/hooks/useProduction";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
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

const GearArchive = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ดึงข้อมูลจริงจาก Supabase
  const { gear, loading, error } = useProductionGear();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Helper เลือกภาษา
  const getLang = (en: string | undefined, th: string | undefined) => {
    return language === "en" ? en || th || "" : th || en || "";
  };

  // ดึง categories ที่ไม่ซ้ำจากข้อมูลจริง
  const categories = useMemo(() => {
    return Array.from(new Set(gear.map((g) => g.category)));
  }, [gear]);

  // กรอง gear ตาม category
  const filteredGear = useMemo(() => {
    if (selectedCategory === "All") return gear;
    return gear.filter((g) => g.category === selectedCategory);
  }, [selectedCategory, gear]);

  // ✅ Delete handler (AlertDialog + toast)
  const handleDelete = async (id: number) => {
    setDeletingId(id);
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
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 🎯 Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 tracking-tight">
              {t(contentData.gearArchive.title)}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-light">
              {t(contentData.gearArchive.subtitle)}
            </p>

            {/* 🔐 Admin Controls */}
            {user && (
              <div className="flex justify-center mt-8">
                <Button asChild size="sm" className="rounded-full px-6 shadow-sm">
                  <Link to="/admin/gear/add">
                    <Plus className="mr-2 h-4 w-4" />
                    {language === "en" ? "Add Gear" : "เพิ่มอุปกรณ์"}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* ⏳ Loading State */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            </div>
          ) : error ? (
            /* ❌ Error State */
            <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto">
              <Wrench className="h-12 w-12 text-destructive/40 mx-auto mb-4" />
              <p className="text-destructive font-semibold text-lg mb-2">
                {language === "en" ? "Failed to load gear" : "โหลดอุปกรณ์ไม่สำเร็จ"}
              </p>
              <p className="text-destructive/70 text-sm mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="h-11 px-8 shadow-sm hover:shadow-md transition-all duration-300 rounded-full font-medium"
              >
                {language === "en" ? "Try Again" : "ลองใหม่"}
              </Button>
            </div>
          ) : (
            <>
              {/* 🔍 Filter Section (Glassmorphism Pill) */}
              <div className="mb-10 flex justify-center animate-fade-in-up stagger-1">
                <div className="flex flex-wrap justify-center gap-2.5 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-sm">
                  <Badge
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    className={`cursor-pointer px-5 py-2 text-sm rounded-xl transition-all duration-300 border-transparent ${
                      selectedCategory === "All"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-transparent text-muted-foreground hover:bg-muted hover:text-primary"
                    }`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    {t(contentData.gearArchive.allCategory)}
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={`cursor-pointer px-5 py-2 text-sm rounded-xl transition-all duration-300 border-transparent ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-transparent text-muted-foreground hover:bg-muted hover:text-primary"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 📚 Gear Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredGear.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative group animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
                  >
                    {/* 🎨 Card ไร้ขอบ + เงาพรีเมียม */}
                    <div className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.04)] h-full flex flex-col hover:shadow-[0_10px_30px_rgb(222,49,99,0.1)] hover:-translate-y-1 transition-all duration-500">
                      
                      {/* 🖼️ Cover - ใช้ aspect-square และ Mask เฟดขาว */}
                      <div className="aspect-square w-full bg-gradient-to-br from-primary/5 to-muted/30 overflow-hidden relative [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={getLang(item.name_en, item.name_th)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Wrench className="w-14 h-14 text-primary/20" />
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-[hsl(var(--ds-chocolate))] shadow-sm border-none font-medium">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      {/* 📝 Info */}
                      <div className="p-5 flex flex-col flex-1 bg-white">
                        <h3 className="text-lg font-bold text-[hsl(var(--ds-chocolate))] mb-1.5 line-clamp-1 leading-tight">
                          {getLang(item.name_en, item.name_th)}
                        </h3>
                        
                        {(item.brand || item.model) && (
                          <p className="text-xs font-semibold tracking-wider uppercase text-foreground/40 mb-3">
                            {[item.brand, item.model].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        
                        <p className="text-muted-foreground text-sm font-light leading-relaxed line-clamp-2 mb-4 flex-1">
                          {getLang(item.short_desc_en, item.short_desc_th)}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border-none ${
                              item.available !== false
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {item.available !== false
                              ? language === "en" ? "Available" : "พร้อมใช้"
                              : language === "en" ? "Unavailable" : "ไม่ว่าง"}
                          </span>
                          
                          {/* Price Tag (Optional) */}
                          {item.rental_price && (
                            <span className="text-sm font-bold text-primary">
                              ฿{item.rental_price.toLocaleString()}
                              <span className="text-[10px] text-muted-foreground font-normal">/day</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 🔐 Admin: Edit / Delete overlay (Hover ถึงจะแสดง) */}
                    {user && (
                      <div className="absolute top-12 right-3 z-50 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-primary shadow-sm border border-border/50 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/gear/edit/${item.id}`);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8 shadow-sm rounded-lg"
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[hsl(var(--ds-chocolate))]">ยืนยันการลบ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                ลบ "{getLang(item.name_en, item.name_th)}" —
                                การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
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

              {/* 📭 Empty State */}
              {filteredGear.length === 0 && (
                <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-0 shadow-sm max-w-2xl mx-auto mt-8">
                  <Wrench className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">
                    {t(contentData.gearArchive.noResults)}
                  </p>
                  {user && (
                    <Button asChild className="mt-6 rounded-full px-6 shadow-md">
                      <Link to="/admin/gear/add">
                        <Plus className="mr-2 h-4 w-4" /> Add First Gear
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GearArchive;