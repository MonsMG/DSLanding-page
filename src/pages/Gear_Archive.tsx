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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
              {t(contentData.gearArchive.title)}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {t(contentData.gearArchive.subtitle)}
            </p>

            {/* 🔐 Admin Controls */}
            {user && (
              <div className="flex gap-2 justify-end mt-4 ">
                <div className="flex gap-2 bg-white/80 p-2 rounded-lg border border-primary/20 shadow-lg">
                  <Button asChild size="sm">
                    <Link to="/admin/gear/add">
                      <Plus className="mr-2 h-4 w-4" />
                      {language === "en" ? "Add Gear" : "เพิ่มอุปกรณ์"}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                {language === "en" ? "Loading gear..." : "กำลังโหลดอุปกรณ์..."}
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="min-h-[40vh] flex flex-col items-center justify-center">
              <Wrench className="h-16 w-16 text-destructive/30 mb-4" />
              <p className="text-destructive font-medium mb-2">
                {language === "en"
                  ? "Failed to load gear"
                  : "โหลดอุปกรณ์ไม่สำเร็จ"}
              </p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 h-11 px-6 shadow-[0_4px_14px_rgb(222,49,99,0.3)] hover:shadow-[0_6px_20px_rgb(222,49,99,0.4)] transition-all duration-300 rounded-xl font-medium"
              >
                {language === "en" ? "Try Again" : "ลองใหม่"}
              </Button>
            </div>
          ) : (
            <>
              {/* Filter Section */}
              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge
                    variant={selectedCategory === "All" ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-1.5 text-sm rounded-full transition-all ${
                      selectedCategory === "All"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-card/80 hover:bg-muted border-border"
                    }`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    {t(contentData.gearArchive.allCategory)}
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-1.5 text-sm rounded-full transition-all ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-card/80 hover:bg-muted border-border"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gear Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGear.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative group animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
                  >
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {/* Cover */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-[hsl(var(--ds-cream))] to-[hsl(var(--ds-beige))] flex items-center justify-center relative overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={getLang(item.name_en, item.name_th)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Wrench
                            className="w-14 h-14 text-primary"
                            strokeWidth={1.5}
                          />
                        )}
                        {/* Category Badge */}
                        <div className="absolute top-2 right-2 ">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-card/90 px-2 py-0.5 text-black"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        {/* Availability Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={`text-xs px-2 py-0.5 ${
                              item.available !== false
                                ? "bg-green-500/90 text-white"
                                : "bg-gray-500/90 text-white"
                            }`}
                          >
                            {item.available !== false
                              ? language === "en"
                                ? "Available"
                                : "พร้อมใช้งาน"
                              : language === "en"
                                ? "Unavailable"
                                : "ไม่พร้อมใช้งาน"}
                          </Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-primary mb-1">
                          {getLang(item.name_en, item.name_th)}
                        </h3>
                        {(item.brand || item.model) && (
                          <p className="text-xs text-foreground/50 mb-2">
                            {[item.brand, item.model]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <p className="text-foreground/70 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                          {getLang(item.short_desc_en, item.short_desc_th)}
                        </p>

                        {/* Specs (if any) */}
                        {item.specs && (
                          <p className="text-[11px] text-foreground/50 line-clamp-1 mb-3 italic">
                            {item.specs}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 🔐 Admin: Edit / Delete overlay */}
                    {user && (
                      <div className="absolute top-10 right-3 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7 bg-white/90 hover:bg-white shadow"
                          onClick={() =>
                            navigate(`/admin/gear/edit/${item.id}`)
                          }
                        >
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </Button>

                        {/* AlertDialog ยืนยันก่อนลบ */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-7 w-7 shadow"
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
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
                                onClick={() => handleDelete(item.id)}
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

              {/* Empty State */}
              {filteredGear.length === 0 && (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-border">
                  <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {t(contentData.gearArchive.noResults)}
                  </p>
                  {user && (
                    <Button asChild className="mt-4">
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
