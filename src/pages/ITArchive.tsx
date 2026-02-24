/**
 * 📂 ITArchive.tsx — คลังผลงานซอฟต์แวร์ทั้งหมด
 *
 * ดึงข้อมูลจาก Supabase ผ่าน useSoftwareProjects hook
 * รองรับ: Filter ตาม category, Loading/Error states, Admin CRUD
 */

import { useState, useMemo } from "react";
import { Loader2, Code2, Pencil, Trash2, Plus, LogOut } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
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
  const { user, signOut } = useAuth();
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
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-beige))] to-[hsl(var(--ds-cream))]" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
              {t(contentData.archive.title)}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {t(contentData.archive.subtitle)}
            </p>

            {/* 🔐 Admin Controls */}
            {user && (
              <div className="flex gap-2 justify-center mt-4">
                <div className="flex gap-2 bg-white/80 p-2 rounded-lg border border-primary/20 shadow-lg">
                  <Button asChild size="sm">
                    <Link to="/admin/software/add">
                      <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Link>
                  </Button>
                  <Button onClick={signOut} variant="destructive" size="sm">
                    <LogOut className="h-4 w-4" />
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
                {language === "en"
                  ? "Loading projects..."
                  : "กำลังโหลดโปรเจกต์..."}
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="min-h-[40vh] flex flex-col items-center justify-center">
              <Code2 className="h-16 w-16 text-destructive/30 mb-4" />
              <p className="text-destructive font-medium mb-2">
                {language === "en"
                  ? "Failed to load projects"
                  : "โหลดโปรเจกต์ไม่สำเร็จ"}
              </p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
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
                    {t(contentData.archive.allCategory)}
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

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="relative group">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {/* Cover */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-[hsl(var(--ds-cream))] to-[hsl(var(--ds-beige))] flex items-center justify-center relative overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={getLang(project.title_en, project.title_th)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Code2
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
                            {project.category}
                          </Badge>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={`text-xs px-2 py-0.5 ${
                              project.status === "Active"
                                ? "bg-green-500/90 text-white"
                                : project.status === "Coming Soon"
                                  ? "bg-amber-500/90 text-white"
                                  : "bg-gray-500/90 text-white"
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-primary mb-2">
                          {getLang(project.title_en, project.title_th)}
                        </h3>
                        <p className="text-foreground/70 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                          {getLang(
                            project.short_desc_en,
                            project.short_desc_th,
                          )}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <Link
                            to={`/it/project/${project.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold rounded-lg text-xs h-8"
                            >
                              {language === "en"
                                ? "View Details"
                                : "ดูรายละเอียด"}
                            </Button>
                          </Link>
                          {project.url && (
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(
                                  project.url,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                              className="flex-1 bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold rounded-lg text-xs h-8"
                            >
                              {language === "en" ? "Visit" : "เยี่ยมชม"}
                            </Button>
                          )}
                        </div>
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
                            navigate(`/admin/software/edit/${project.id}`)
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
                              disabled={deletingId === project.id}
                            >
                              {deletingId === project.id ? (
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
                                ลบ "
                                {getLang(project.title_en, project.title_th)}" —
                                การลบจะไม่สามารถกู้คืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
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
              {filteredProjects.length === 0 && (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-border">
                  <Code2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {t(contentData.archive.noResults)}
                  </p>
                  {user && (
                    <Button asChild className="mt-4">
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

      <FloatingChatButton />
    </div>
  );
};

export default ITArchive;
