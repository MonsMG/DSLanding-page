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
import { Link, useNavigate } from "react-router-dom";
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
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useSoftwareProjects } from "@/hooks/useSoftwareProjects";
import { useToast } from "@/hooks/use-toast";

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
  DialogTrigger,
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
import { SoftwareProject } from "@/types";

interface ProjectCardItemProps {
  project: SoftwareProject;
  idx: number;
  language: string;
  getLang: (en?: string, th?: string) => string;
  user: unknown;
  deletingId: number | null;
  handleDelete: (id: number) => void;
  navigate: unknown;
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
      className={`flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-md overflow-hidden group ${isFeatured ? "ring-2 ring-primary/50" : ""} animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
    >
      {/* Project Image */}
      <div className="h-48 bg-muted relative overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <BadgeCheck className="w-16 h-16 text-primary/20" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge className="bg-white/90 text-primary hover:bg-white shadow-sm">
            {project.category}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl text-[hsl(var(--ds-chocolate))] line-clamp-2">
          {getLang(project.title_en, project.title_th)}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {getLang(project.short_desc_en, project.short_desc_th)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-5 pb-5 border-t bg-gradient-to-b from-transparent to-muted/20">
        <div className="flex w-full gap-3">
          {/* ปุ่ม: เปิด App */}
          {project.url && (
            <Button
              asChild
              className="flex-1 h-11 shadow-[0_4px_14px_rgb(222,49,99,0.3)] hover:shadow-[0_6px_20px_rgb(222,49,99,0.4)] transition-all duration-300 rounded-xl font-medium"
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
            className={`flex-1 h-11 transition-all duration-300 rounded-xl font-medium ${!project.url ? "shadow-[0_4px_14px_rgb(222,49,99,0.3)] hover:shadow-[0_6px_20px_rgb(222,49,99,0.4)]" : "bg-white/50 backdrop-blur-md border border-[hsl(var(--ds-red-orange))]/30 hover:bg-[hsl(var(--ds-cream))] hover:text-primary shadow-sm"}`}
          >
            <Link to={`/software/project/${project.id}`}>
              <Info className="mr-2 h-4 w-4" />
              {language === "en" ? "View Details" : "รายละเอียด"}
            </Link>
          </Button>
        </div>

        {/* 🔐 Admin: Edit / Delete */}
        {user && (
          <div className="flex gap-2 w-full pt-2 border-t border-dashed border-primary/30">
            <Button
              variant="secondary"
              className="flex-1 text-xs h-8"
              onClick={() => navigate(`/admin/software/edit/${project.id}`)}
            >
              <Pencil className="mr-2 h-3 w-3" /> Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 text-xs h-8"
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-3 w-3" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ยืนยันการลบ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    ลบ "{getLang(project.title_en, project.title_th)}" —
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

  // ✅ ใช้ custom hook แทน inline fetch (fix #5)
  const { projects: allProjects, loading, error } = useSoftwareProjects();

  // State สำหรับ category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // กรองเฉพาะ Active projects
  const activeProjects = allProjects.filter((p) => p.status === "Active");

  // กรองโปรเจกต์ทั่วไป (ไม่ใช่ Featured) นำไปแสดงผลและเข้า Filter
  const nonFeaturedProjects = activeProjects.filter((p) => !p.featured_slot);

  // สร้างรายการ Category แบบไม่ซ้ำเพื่อทำปุ่ม Filter จาก **เฉพาะ Normal Projects**
  const categories = Array.from(
    new Set(nonFeaturedProjects.map((p) => p.category || "Other")),
  ).sort();

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
      // 1. เคลียร์โปรเจกต์เดิมที่มี slot นี้อยู่ให้ออกเป็น null
      const existingProject = featuredProjects.find(
        (p) => p.featured_slot === targetSlot,
      );
      if (existingProject && existingProject.id !== projectId) {
        await supabase
          .from("software_projects")
          .update({ featured_slot: null })
          .eq("id", existingProject.id);
      }

      // 2. เคลียร์โปรเจกต์ที่จะตั้ง (ถ้ามันอยู่ slot อื่นอยู่ก่อนแล้ว) แต่เพื่อให้ง่าย เราแค่ยัดค่าใส่เลย
      // 3. เซฟโปรเจกต์เป้าหมายเป็น Slot ใหม่
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

  // ✅ Delete handler ที่ถูกต้อง (fix #1)
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
      // Reload data สด ๆ แทน window.location.reload()
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

  const scrollToProjects = () => {
    const section = document.getElementById("software-projects");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-beige))] to-[hsl(var(--ds-cream))]" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden my-0 py-[50px]">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="text-left flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 whitespace-pre-line animate-fade-in-up">
                Designed to Solve.{"\n"}Built to Improve.
              </h1>
              <p className="text-left sm:text-xl text-foreground/70 max-w-2xl animate-fade-in-up stagger-2">
                {language === "en"
                  ? "Crafting innovative digital solutions that streamline workflows and enhance productivity."
                  : "สร้างสรรค์นวัตกรรมดิจิทัลเพื่อแก้ปัญหา พัฒนากระบวนการทำงาน และเพิ่มประสิทธิภาพสู่ความสำเร็จ"}
              </p>

              <div className="mt-12 flex gap-4 animate-fade-in-up stagger-3">
                <Button
                  onClick={scrollToProjects}
                  size="lg"
                  className="h-14 px-8 text-base shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] w-full sm:w-auto font-medium tracking-wide"
                >
                  {language === "en" ? "View Projects" : "ดูผลงาน"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section A: Software Projects (Dynamic) ===== */}
      <section id="software-projects" className="relative z-10 py-12 px-[25px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up md:flex md:justify-between md:items-end">
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] text-center md:text-left">
              {language === "en" ? "Software Projects" : "โปรเจกต์ซอฟต์แวร์"}
            </h2>

            {/* 🔐 Admin Controls */}
            {user && (
              <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0 bg-white/80 p-2 rounded-lg border border-primary/20 shadow-lg w-fit mx-auto md:mx-0">
                {/* ปุ่ม Manage Slots */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSlotModalOpen(true)}
                  className="border-primary/50 text-primary hover:bg-primary hover:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" /> Manage Slots
                </Button>
              </div>
            )}
          </div>

          {/* Slot Management Modal (Admin Only) */}
          {user && (
            <Dialog open={slotModalOpen} onOpenChange={setSlotModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2 text-[hsl(var(--ds-chocolate))]">
                    <Settings className="w-6 h-6 text-primary" />
                    Manage Featured Slots
                  </DialogTitle>
                  <DialogDescription>
                    Select which projects should appear in Slot 1, 2, and 3 at
                    the top of the IT frontpage.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {[1, 2, 3].map((slotNum) => {
                    const currentProjectInSlot = featuredProjects.find(
                      (p) => p.featured_slot === slotNum,
                    );

                    return (
                      <div
                        key={slotNum}
                        className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-lg text-primary flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5" />
                            Slot {slotNum}
                          </h4>
                          {currentProjectInSlot && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                              disabled={savingSlot}
                              onClick={() =>
                                handleClearSlot(currentProjectInSlot.id)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Select
                            disabled={savingSlot}
                            value={
                              currentProjectInSlot?.id.toString() || "none"
                            }
                            onValueChange={(val) => {
                              if (val !== "none") {
                                handleSlotChange(parseInt(val), slotNum);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-white">
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
                                <SelectItem key={p.id} value={p.id.toString()}>
                                  {p.featured_slot
                                    ? `[Slot ${p.featured_slot}] `
                                    : ""}
                                  {p.title_en}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            /* ✅ Error State (fix #6) */
            <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20">
              <p className="text-destructive font-medium mb-2">
                Failed to load projects
              </p>
              <p className="text-muted-foreground text-sm">
                Please refresh the page or try again later.
              </p>
            </div>
          ) : activeProjects.length === 0 ? (
            /* ✅ Empty State (fix #6) */
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-border">
              <BadgeCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                {language === "en"
                  ? "No projects available yet."
                  : "ยังไม่มีโปรเจกต์ในขณะนี้"}
              </p>
              {user && (
                <Button asChild className="mt-4">
                  <Link to="/admin/software/add">
                    <Plus className="mr-2 h-4 w-4" /> Add First Project
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* === FEATURED PROJECTS SECITON === */}
              {selectedCategory === "All" && featuredProjects.length > 0 && (
                <div className="mb-16">
                  {/* <h3 className="text-2xl font-bold text-[hsl(var(--ds-red-orange))] flex items-center gap-2 mb-6">
                    <BadgeCheck className="w-6 h-6" />
                    {language === "en"
                      ? "Featured Projects"
                      : "โปรเจกต์โดดเด่น"}
                  </h3> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                  {displayedProjects.length > 0 && (
                    <div className="mt-12 mb-6 flex items-center">
                      <div className="h-px bg-border flex-grow"></div>
                      <span className="px-4 text-muted-foreground bg-background">
                        {language === "en" ? "More Projects" : "โปรเจกต์อื่นๆ"}
                      </span>
                      <div className="h-px bg-border flex-grow"></div>
                    </div>
                  )}
                </div>
              )}

              {/* === NORMAL PROJECTS GRID === */}
              {displayedProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          {/* View Archive */}
          <div className="flex justify-end mt-12">
            <Link to="/software/archive">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base bg-white/50 backdrop-blur-md border border-[hsl(var(--ds-red-orange))]/30 text-[hsl(var(--ds-chocolate))] hover:bg-[hsl(var(--ds-cream))] hover:text-primary transition-all duration-300 rounded-[20px] shadow-sm font-medium tracking-wide"
              >
                {language === "en" ? "View More Archive" : "ดูผลงานทั้งหมด"}
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
      <FloatingChatButton />
    </div>
  );
};

export default IT;
