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

const IT = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ ใช้ custom hook แทน inline fetch (fix #5)
  const { projects: allProjects, loading, error } = useSoftwareProjects();

  // กรองเฉพาะ Active projects
  const projects = allProjects.filter((p) => p.status === "Active");

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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 whitespace-pre-line">
                Designed to Solve.{"\n"}Built to Improve.
              </h1>
              <p className="text-left sm:text-xl text-foreground/70 max-w-2xl">
                {language === "en"
                  ? "Crafting innovative digital solutions that streamline workflows and enhance productivity."
                  : "สร้างสรรค์นวัตกรรมดิจิทัลเพื่อแก้ปัญหา พัฒนากระบวนการทำงาน และเพิ่มประสิทธิภาพสู่ความสำเร็จ"}
              </p>

              <div className="mt-12 flex gap-4">
                <Button
                  onClick={scrollToProjects}
                  size="lg"
                  className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl"
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
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))]">
              {language === "en" ? "Software Projects" : "โปรเจกต์ซอฟต์แวร์"}
            </h2>
            <div className="flex mt-10 justify-self-end">
              {/* 🔐 Admin Panel (เฉพาะ Login แล้ว) */}
              {user && (
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-primary/20 shadow-lg flex flex-col gap-3 min-w-[200px]">
                  <div className="text-xs font-bold text-primary uppercase tracking-widest text-center">
                    Admin Control
                  </div>
                  <Button
                    asChild
                    variant="default"
                    className="w-full justify-start"
                  >
                    <Link to="/admin/software/add">
                      <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Link>
                  </Button>
                  <Button
                    onClick={signOut}
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

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
          ) : projects.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="flex flex-col h-full hover:shadow-xl transition-all border-none shadow-md overflow-hidden group"
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
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-primary hover:bg-white">
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-[hsl(var(--ds-chocolate))]">
                      {getLang(project.title_en, project.title_th)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {getLang(project.short_desc_en, project.short_desc_th)}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-2 pt-4 border-t bg-muted/5">
                    {/* ปุ่ม: เปิด App */}
                    {project.url && (
                      <Button asChild className="flex-1" variant="default">
                        <a href={project.url} target="_blank" rel="noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          {language === "en" ? "Open App" : "เปิดใช้งาน"}
                        </a>
                      </Button>
                    )}

                    {/* ปุ่ม: Details (Dialog) */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 border-primary/20 text-primary hover:bg-primary/5"
                        >
                          <Info className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center gap-2 text-primary">
                            {getLang(project.title_en, project.title_th)}
                          </DialogTitle>
                          <DialogDescription>
                            {project.category}
                          </DialogDescription>
                        </DialogHeader>

                        {project.image_url && (
                          <div className="w-full h-64 bg-muted rounded-lg overflow-hidden mb-4 shadow-inner">
                            <img
                              src={project.image_url}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="space-y-6">
                          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <p className="text-foreground leading-relaxed whitespace-pre-line">
                              {getLang(
                                project.full_desc_en,
                                project.full_desc_th,
                              ) ||
                                getLang(
                                  project.short_desc_en,
                                  project.short_desc_th,
                                )}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-bold mb-2 text-[hsl(var(--ds-chocolate))]">
                              🎯 Target Audience
                            </h4>
                            <div className="ml-2 text-sm text-muted-foreground whitespace-pre-line border-l-2 border-primary/30 pl-4">
                              {getLang(project.target_en, project.target_th) ||
                                "-"}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold mb-2 text-[hsl(var(--ds-chocolate))]">
                              ✨ Key Features
                            </h4>
                            <div className="ml-2 text-sm text-muted-foreground whitespace-pre-line border-l-2 border-primary/30 pl-4">
                              {getLang(
                                project.features_en,
                                project.features_th,
                              ) || "-"}
                            </div>
                          </div>

                          {project.url && (
                            <div className="pt-6 mt-4 border-t flex justify-end">
                              <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto"
                              >
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Go to Application{" "}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 🔐 Admin: Edit / Delete (เห็นเฉพาะ Login) */}
                    {user && (
                      <div className="flex gap-2 w-full pt-2 border-t border-dashed border-primary/30">
                        <Button
                          variant="secondary"
                          className="flex-1 text-xs h-8"
                          onClick={() =>
                            navigate(`/admin/software/edit/${project.id}`)
                          }
                        >
                          <Pencil className="mr-2 h-3 w-3" /> Edit
                        </Button>

                        {/* ✅ AlertDialog แทน confirm() (fix #1) */}
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
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* View Archive */}
          <div className="flex justify-end mt-12">
            <Link to="/it/archive">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-base font-semibold rounded-xl"
              >
                {language === "en" ? "View More Archive" : "ดูผลงานทั้งหมด"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Section B: Technical Skills (Static) ===== */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto py-[15px]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center">
            {language === "en" ? "Technical Skills" : "ทักษะทางเทคนิค"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name.en}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
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
