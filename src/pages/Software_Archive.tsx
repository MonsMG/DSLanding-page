/**
 * 📂 ITArchive.tsx — คลังผลงานซอฟต์แวร์ทั้งหมด
 *
 * ดึงข้อมูลจาก Supabase ผ่าน useSoftwareProjects hook
 * รองรับ: Filter ตาม category, Loading/Error states, Admin CRUD
 */

import { useState, useMemo } from "react";
import { Loader2, Code2, Pencil, Trash2, Plus, ArrowRight, BadgeCheck } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { contentData } from "@/data/content";
import { useSoftwareProjects } from "@/hooks/useSoftwareProjects";
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

const ITArchive = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ดึงข้อมูลจริงจาก Supabase
  const { projects, loading, error } = useSoftwareProjects();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Helper เลือกภาษา
  const getLang = (en: string | undefined, th: string | undefined) => {
    return language === "en" ? en || th || "" : th || en || "";
  };

  // ดึง categories ที่ไม่ซ้ำจากข้อมูลจริง
  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.category)));
  }, [projects]);

  // กรอง projects ตาม category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, projects]);

  // ✅ Delete handler (AlertDialog + toast)
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("software_projects")
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

      toast({ title: "Deleted", description: "Project deleted successfully." });
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
              {t(contentData.archive.title)}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-light">
              {t(contentData.archive.subtitle)}
            </p>

            {/* 🔐 Admin Controls */}
            {user && (
              <div className="flex justify-center mt-6">
                <Button asChild size="sm" className="rounded-full px-6 shadow-sm">
                  <Link to="/admin/software/add">
                    <Plus className="mr-2 h-4 w-4" />
                    {language === "en" ? "Add Software" : "เพิ่มซอฟต์แวร์"}
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
              <Code2 className="h-12 w-12 text-destructive/40 mx-auto mb-4" />
              <p className="text-destructive font-semibold text-lg mb-2">
                {language === "en" ? "Failed to load projects" : "โหลดโปรเจกต์ไม่สำเร็จ"}
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
              {/* 🔍 Filter Section */}
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
                    {t(contentData.archive.allCategory)}
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

              {/* 📚 Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProjects.map((project, idx) => (
                  <div
                    key={project.id}
                    className={`relative group animate-fade-in-up stagger-${Math.min(idx + 1, 8)}`}
                  >
                    {/* 🎨 Card ไร้ขอบ + เงาพรีเมียม แบบเดียวกับหน้า IT.tsx */}
                    <div className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.04)] h-full flex flex-col hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                      
                      {/* 🖼️ Cover - ใช้ aspect-video */}
                      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={getLang(project.title_en, project.title_th)}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <BadgeCheck className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-[hsl(var(--ds-chocolate))] hover:bg-white shadow-sm border-none font-medium">
                            {project.category}
                          </Badge>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={`text-[10px] px-2.5 py-0.5 border-none shadow-sm ${
                              project.status === "Active"
                                ? "bg-emerald-500/90 text-white"
                                : project.status === "Coming Soon"
                                  ? "bg-amber-500/90 text-white"
                                  : "bg-slate-500/90 text-white"
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      {/* 📝 Info */}
                      <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-muted/10">
                        <h3 className="text-lg font-bold text-[hsl(var(--ds-chocolate))] mb-2 line-clamp-2 leading-tight">
                          {getLang(project.title_en, project.title_th)}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
                          {getLang(project.short_desc_en, project.short_desc_th)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 mt-auto">
                          <Button
                            asChild
                            variant={project.url ? "outline" : "default"}
                            className={`flex-1 h-10 rounded-xl text-xs font-medium transition-all ${
                              !project.url
                                ? "shadow-sm hover:shadow"
                                : "bg-white border-border/60 hover:bg-muted hover:text-primary shadow-sm"
                            }`}
                          >
                            <Link to={`/software/project/${project.id}`}>
                              {language === "en" ? "Details" : "รายละเอียด"}
                            </Link>
                          </Button>

                          {project.url && (
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(project.url, "_blank", "noopener,noreferrer")
                              }
                              className="flex-1 h-10 shadow-sm hover:shadow transition-all rounded-xl text-xs font-medium"
                            >
                              {language === "en" ? "Visit App" : "เปิดใช้งาน"}
                            </Button>
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
                          onClick={() => navigate(`/admin/software/edit/${project.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8 shadow-sm rounded-lg"
                              disabled={deletingId === project.id}
                            >
                              {deletingId === project.id ? (
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
                                ลบ "{getLang(project.title_en, project.title_th)}" —
                                การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
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
              {filteredProjects.length === 0 && (
                <div className="text-center py-24 bg-white/50 rounded-3xl border border-border/50 shadow-sm max-w-2xl mx-auto backdrop-blur-sm mt-8">
                  <Code2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">
                    {t(contentData.archive.noResults)}
                  </p>
                  {user && (
                    <Button asChild className="mt-6 rounded-full px-6 shadow-md">
                      <Link to="/admin/software/add">
                        <Plus className="mr-2 h-4 w-4" /> Add First Project
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
      <FloatingChatButton />
    </div>
  );
};

export default ITArchive;