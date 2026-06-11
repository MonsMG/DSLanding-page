/**
 * 💻 IT.tsx — หน้าแสดงผลงาน Software Projects + ทักษะทางเทคนิค
 *
 * แบ่งเป็น 2 sections:
 *   A. Software Projects — ดึงจาก Supabase (dynamic)
 *   B. Technical Skills — ข้อมูล static (ไม่ต้องแก้บ่อย)
 *
 * สำหรับ Admin (login แล้ว):
 *   - เห็น "Admin Control" panel มุมขวา → Add Project / Logout
 *   - เห็นปุ่ม Edit / Delete ใต้ทุกการ์ด
 *   - Delete ใช้ AlertDialog ยืนยัน (ไม่ใช่ confirm() ดิบ)
 */

import { useState } from "react";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import {
  BadgeCheck,
  ArrowRight,
  Code,
  Server,
  Palette,
  LineChart,
  Database,
  Plus,
  LogOut,
  Loader2,
  Globe,
  Info,
  Pencil,
  Trash2,
  Settings,
} from "lucide-react";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useSoftwareProjects } from "@/hooks/useSoftwareProjects";
import { useToast } from "@/components/ui/use-toast";
import { SoftwareProject } from "@/types";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// — ข้อมูล Skills (Static) —
const skills = [
  {
    name: { en: "Front-End Development", th: "พัฒนาส่วนหน้า" },
    icon: Code,
    description: {
      en: "React, TypeScript, Tailwind CSS, responsive design",
      th: "React, TypeScript, Tailwind CSS, การออกแบบที่ตอบสนอง",
    },
  },
  {
    name: { en: "Back-End Development", th: "พัฒนาส่วนหลัง" },
    icon: Server,
    description: {
      en: "Node.js, APIs, database integration, cloud services",
      th: "Node.js, APIs, การเชื่อมต่อฐานข้อมูล, บริการคลาวด์",
    },
  },
  {
    name: { en: "UI/UX Design", th: "ออกแบบ UI/UX" },
    icon: Palette,
    description: {
      en: "User research, wireframing, prototyping, design systems",
      th: "วิจัยผู้ใช้, วางโครงร่าง, สร้างต้นแบบ, ระบบการออกแบบ",
    },
  },
  {
    name: { en: "System Analyst", th: "นักวิเคราะห์ระบบ" },
    icon: Database,
    description: {
      en: "Requirements analysis, system architecture, documentation",
      th: "วิเคราะห์ความต้องการ, สถาปัตยกรรมระบบ, เอกสาร",
    },
  },
  {
    name: { en: "Data Science", th: "วิทยาศาสตร์ข้อมูล" },
    icon: LineChart,
    description: {
      en: "Data analysis, visualization, machine learning basics",
      th: "วิเคราะห์ข้อมูล, แสดงผลข้อมูล, พื้นฐาน Machine Learning",
    },
  },
];

// ==========================================
// Sub-Component: ProjectCardItem
// ==========================================
interface ProjectCardItemProps {
  project: SoftwareProject;
  idx: number;
  language: string;
  getLang: (en?: string, th?: string) => string;
  user: unknown;
  deletingId: number | null;
  handleDelete: (id: number) => void;
  navigate: NavigateFunction;
  isFeatured: boolean;
}

const ProjectCardItem = ({
  project,
  idx,
  language,
  getLang,
  user,
  deletingId,
  handleDelete,
  navigate,
  isFeatured,
}: ProjectCardItemProps) => {
  return (
    <Card
      // 🎨 ใส่ border-0 เข้าไปเพื่อบังคับลบเส้นขอบทุกชนิดทิ้ง!
      className={`flex flex-col h-full hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white animate-fade-in-up stagger-${Math.min(idx + 1, 6)}
        ${
          isFeatured
            ? "border-0 shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgb(222,49,99,0.15)]" // ไร้ขอบ + ใช้เงาฟุ้งๆ สีอมแดงให้รู้ว่าเป็น Featured
            : "border-0 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-lg" // ไร้ขอบ + เงาเทาปกติ
        }
      `}
    >
      {/* 🖼️ Project Image */}
      {/* ปรับใช้ aspect-video (16:9) เพื่อบังคับให้รูปสัดส่วนเท่ากันทุกใบ และไม่เพี้ยนตามความกว้างจอ */}
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt="Cover"
            // เอาเอฟเฟกต์ซูมออก และใช้ object-center เพื่อให้จุดโฟกัสอยู่ตรงกลางเสมอ
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <BadgeCheck className="w-16 h-16 text-primary/20" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge className="bg-white/90 backdrop-blur-sm text-[hsl(var(--ds-chocolate))] hover:bg-white shadow-sm border-none">
            {project.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-5 pb-2">
        <CardTitle className="text-xl font-bold text-[hsl(var(--ds-chocolate))] line-clamp-2 leading-tight">
          {getLang(project.title_en, project.title_th)}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {getLang(project.short_desc_en, project.short_desc_th)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 pb-5 border-t border-border/40 bg-gradient-to-b from-transparent to-muted/10">
        <div className="flex w-full gap-3">
          {/* ปุ่ม: เปิด App */}
          {project.url && (
            <Button
              asChild
              className="flex-1 h-10 shadow-sm hover:shadow transition-all duration-300 rounded-xl font-medium"
              variant="default"
            >
              <a href={project.url} target="_blank" rel="noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                {language === "en" ? "Visit App" : "เปิดใช้งาน"}
              </a>
            </Button>
          )}

          {/* ปุ่ม: Details */}
          <Button
            asChild
            variant={project.url ? "outline" : "default"}
            className={`flex-1 h-10 transition-all duration-300 rounded-xl font-medium ${
              !project.url
                ? "shadow-sm hover:shadow"
                : "bg-white border-border/60 hover:bg-muted hover:text-primary shadow-sm"
            }`}
          >
            <Link to={`/software/project/${project.id}`}>
              <Info className="mr-2 h-4 w-4" />
              {language === "en" ? "View Details" : "รายละเอียด"}
            </Link>
          </Button>
        </div>

        {/* 🔐 Admin: Edit / Delete */}
        {user && (
          <div className="flex gap-3 w-full pt-3 border-t border-dashed border-border">
            <Button
              variant="outline"
              className="flex-1 text-xs h-8 rounded-lg border-border/60 hover:bg-primary/5 hover:text-primary"
              onClick={() => navigate(`/admin/software/edit/${project.id}`)}
            >
              <Pencil className="mr-1.5 h-3 w-3" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 text-xs h-8 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? (
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1.5 h-3 w-3" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[hsl(var(--ds-chocolate))]">
                    ยืนยันการลบ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ลบ "{getLang(project.title_en, project.title_th)}" —
                    การลบจะไม่สามารถกู้คืนได้
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>
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
      </CardFooter>
    </Card>
  );
};

// ==========================================
// Main Component
// ==========================================
const IT = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ใช้ custom hook แทน inline fetch
  const { projects: allProjects, loading, error } = useSoftwareProjects();

  // State สำหรับ category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // กรองเฉพาะ Active projects
  const activeProjects = allProjects.filter((p) => p.status === "Active");

  // กรองโปรเจกต์ทั่วไป (ไม่ใช่ Featured) นำไปแสดงผลและเข้า Filter
  const nonFeaturedProjects = activeProjects.filter((p) => !p.featured_slot);

  // กรองโปรเจกต์ที่จะแสดง
  const displayedProjects =
    selectedCategory === "All"
      ? nonFeaturedProjects
      : nonFeaturedProjects.filter(
          (p) => (p.category || "Other") === selectedCategory,
        );

  // ดึง 3 Slots สำหรับ Featured
  const featuredProjects = activeProjects
    .filter((p) => p.featured_slot && p.featured_slot > 0)
    .sort((a, b) => (a.featured_slot || 0) - (b.featured_slot || 0));

  // สถานะเปิด-ปิด Modal จัดการสล็อต
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [savingSlot, setSavingSlot] = useState(false);

  // ฟังก์ชันเซฟ Slot ใหม่ (Admin)
  const handleSlotChange = async (projectId: number, targetSlot: number) => {
    try {
      setSavingSlot(true);
      const existingProject = featuredProjects.find(
        (p) => p.featured_slot === targetSlot,
      );
      if (existingProject && existingProject.id !== projectId) {
        await supabase
          .from("software_projects")
          .update({ featured_slot: null })
          .eq("id", existingProject.id);
      }

      const { error } = await supabase
        .from("software_projects")
        .update({ featured_slot: targetSlot })
        .eq("id", projectId);

      if (error) throw error;
      toast({
        title: "Updated",
        description: `Slot ${targetSlot} updated successfully.`,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: unknown) {
      const e = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "Failed to update slot.",
      });
    } finally {
      setSavingSlot(false);
    }
  };

  const handleClearSlot = async (projectId: number) => {
    try {
      setSavingSlot(true);
      const { error } = await supabase
        .from("software_projects")
        .update({ featured_slot: null })
        .eq("id", projectId);

      if (error) throw error;
      toast({ title: "Removed", description: `Featured slot removed.` });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: unknown) {
      const e = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "Failed to remove slot.",
      });
    } finally {
      setSavingSlot(false);
    }
  };

  // State สำหรับ delete (ป้องกัน double-click)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Helper เลือกภาษา
  const getLang = (en: string | undefined, th: string | undefined) => {
    return language === "en" ? en || th || "" : th || en || "";
  };

  // ✅ Delete handler
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("software_projects")
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden my-0 py-[50px]">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="text-left flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 whitespace-pre-line animate-fade-in-up">
                Designed to Solve.
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 whitespace-pre-line animate-fade-in-up">
                Built to Improve.
              </h1>
              <p className="text-left sm:text-xl text-foreground/70 max-w-2xl animate-fade-in-up stagger-2">
                {language === "en"
                  ? "Crafting innovative digital solutions that streamline workflows and enhance productivity."
                  : "สร้างสรรค์นวัตกรรมดิจิทัลเพื่อแก้ปัญหา พัฒนากระบวนการทำงาน และเพิ่มประสิทธิภาพสู่ความสำเร็จ"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section A: Software Projects (Dynamic) ===== */}
      <section
        id="software-projects"
        className="relative z-10 py-16 md:py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* 🎯 Header & Admin Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight text-center md:text-left">
              {language === "en" ? "Software Projects" : "โปรเจกต์ซอฟต์แวร์"}
            </h2>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSlotModalOpen(true)}
                className="border-[hsl(var(--ds-red-orange))]/30 text-[hsl(var(--ds-red-orange))] hover:bg-[hsl(var(--ds-red-orange))] hover:text-white rounded-full px-6 transition-all shadow-sm"
              >
                <Settings className="mr-2 h-4 w-4" /> Manage Slots
              </Button>
            )}
          </div>

          {/* ⚙️ Slot Management Modal (Admin Only) */}
          {user && (
            <Dialog open={slotModalOpen} onOpenChange={setSlotModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl flex items-center gap-2 text-[hsl(var(--ds-chocolate))] font-bold">
                    <Settings className="w-6 h-6 text-primary" />
                    Manage Featured Slots
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Select which projects should appear in Slot 1, 2, and 3 at
                    the top of the IT frontpage.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {[1, 2, 3].map((slotNum) => {
                    const currentProjectInSlot = featuredProjects.find(
                      (p) => p.featured_slot === slotNum,
                    );

                    return (
                      <div
                        key={slotNum}
                        className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4 transition-all hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg text-[hsl(var(--ds-chocolate))] flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-primary" />
                            Slot {slotNum}
                          </h4>
                          {currentProjectInSlot && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 rounded-md"
                              disabled={savingSlot}
                              onClick={() =>
                                handleClearSlot(currentProjectInSlot.id)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                            </Button>
                          )}
                        </div>

                        <Select
                          disabled={savingSlot}
                          value={currentProjectInSlot?.id.toString() || "none"}
                          onValueChange={(val) => {
                            if (val !== "none") {
                              handleSlotChange(parseInt(val), slotNum);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full bg-slate-50/50 h-11 border-border/80 focus:ring-primary/20">
                            <SelectValue placeholder="Select a project for this slot..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem
                              value="none"
                              disabled
                              className="font-medium text-muted-foreground"
                            >
                              {currentProjectInSlot
                                ? "Currently selected:"
                                : "-- Select a project --"}
                            </SelectItem>
                            {activeProjects.map((p) => (
                              <SelectItem
                                key={p.id}
                                value={p.id.toString()}
                                className="py-2.5"
                              >
                                {p.featured_slot ? (
                                  <span className="text-primary font-medium mr-1">
                                    [Slot {p.featured_slot}]
                                  </span>
                                ) : (
                                  ""
                                )}
                                {p.title_en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* ⏳ Loading State */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            </div>
          ) : error ? (
            /* ❌ Error State */
            <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
              <p className="text-destructive font-semibold text-lg mb-2">
                Failed to load projects
              </p>
              <p className="text-destructive/70">
                Please refresh the page or try again later.
              </p>
            </div>
          ) : activeProjects.length === 0 ? (
            /* 📭 Empty State */
            <div className="text-center py-24 bg-white/50 rounded-3xl border border-border/50 shadow-sm max-w-2xl mx-auto backdrop-blur-sm">
              <BadgeCheck className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium text-lg">
                {language === "en"
                  ? "No projects available yet."
                  : "ยังไม่มีโปรเจกต์ในขณะนี้"}
              </p>
              {user && (
                <Button asChild className="mt-6 rounded-full px-6 shadow-md">
                  <Link to="/admin/software/add">
                    <Plus className="mr-2 h-4 w-4" /> Add First Project
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* ⭐ FEATURED PROJECTS */}
              {selectedCategory === "All" && featuredProjects.length > 0 && (
                <div className="mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {featuredProjects.map((project, idx) => (
                      <ProjectCardItem
                        key={project.id}
                        project={project}
                        idx={idx}
                        language={language}
                        getLang={getLang}
                        user={user}
                        deletingId={deletingId}
                        handleDelete={handleDelete}
                        navigate={navigate}
                        isFeatured
                      />
                    ))}
                  </div>

                  {/* Elegant Divider */}
                  {displayedProjects.length > 0 && (
                    <div className="mt-16 mb-8 flex items-center justify-center">
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-grow max-w-[200px]"></div>
                      <span className="px-6 text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
                        {language === "en" ? "More Projects" : "โปรเจกต์อื่นๆ"}
                      </span>
                      <div className="h-px bg-gradient-to-r from-border via-border to-transparent flex-grow max-w-[200px]"></div>
                    </div>
                  )}
                </div>
              )}

              {/* 📚 NORMAL PROJECTS */}
              {displayedProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {displayedProjects.map((project, idx) => (
                    <ProjectCardItem
                      key={project.id}
                      project={project}
                      idx={idx}
                      language={language}
                      getLang={getLang}
                      user={user}
                      deletingId={deletingId}
                      handleDelete={handleDelete}
                      navigate={navigate}
                      isFeatured={false}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* 🚀 View Archive */}
          <div className="flex justify-center mt-16">
            <Link to="/software/archive">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base bg-white/50 backdrop-blur-md border border-border/60 text-[hsl(var(--ds-chocolate))] hover:bg-white hover:border-[hsl(var(--ds-red-orange))]/50 hover:text-[hsl(var(--ds-red-orange))] transition-all duration-300 rounded-full shadow-sm hover:shadow-md font-medium"
              >
                {language === "en" ? "View Archive" : "ดูผลงานทั้งหมด"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto section-divider" />
      </div>

      {/* ===== Section B: Technical Skills (Static) ===== */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto py-[15px]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center animate-fade-in-up">
            {language === "en" ? "Technical Skills" : "ทักษะทางเทคนิค"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {skills.map((skill, idx) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name.en}
                  className={`bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up stagger-${idx + 1}`}
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent
                      className="w-7 h-7 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-base font-bold text-[hsl(var(--ds-chocolate))] mb-2">
                    {language === "en" ? skill.name.en : skill.name.th}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {language === "en"
                      ? skill.description.en
                      : skill.description.th}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IT;
