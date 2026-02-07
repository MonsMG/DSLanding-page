import { useState, useMemo } from "react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import ProjectCard from "@/components/it/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CalendarCheck, Mail, Database, Layout, Server, Cloud, Shield, Cpu } from "lucide-react";

interface Project {
  id: string;
  name: { en: string; th: string };
  link: string;
  description: { en: string; th: string };
  category: { en: string; th: string };
  icon: LucideIcon;
}

const allProjects: Project[] = [
  {
    id: "1",
    name: { en: "Check-in System", th: "ระบบเช็คชื่อ" },
    link: "https://check-it-ouch.lovable.app/",
    description: { en: "A streamlined check-in system for tracking attendance and achievements with real-time updates.", th: "ระบบเช็คชื่อที่ทันสมัย สำหรับติดตามการเข้าเรียนและความสำเร็จแบบเรียลไทม์" },
    category: { en: "Web App", th: "เว็บแอป" },
    icon: BadgeCheck,
  },
  {
    id: "2",
    name: { en: "Freetime Matcher", th: "ระบบจัดตารางเวลา" },
    link: "https://ft-matcher.lovable.app/",
    description: { en: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.", th: "เครื่องมือจัดตารางเวลาอัจฉริยะ สำหรับจับคู่เวลาว่างและประสานงานประชุมทีม" },
    category: { en: "Web App", th: "เว็บแอป" },
    icon: CalendarCheck,
  },
  {
    id: "3",
    name: { en: "Messaging Hub", th: "ศูนย์กลางสื่อสาร" },
    link: "https://tagcast-connect.lovable.app",
    description: { en: "Unified communication platform for seamless team messaging and broadcast announcements.", th: "แพลตฟอร์มสื่อสารรวมศูนย์ เพื่อการส่งข้อความทีมและประกาศข่าวสาร" },
    category: { en: "Web App", th: "เว็บแอป" },
    icon: Mail,
  },
  {
    id: "4",
    name: { en: "Data Analytics Dashboard", th: "แดชบอร์ดวิเคราะห์ข้อมูล" },
    link: "https://example.com/analytics",
    description: { en: "Comprehensive data visualization and analytics platform for business intelligence.", th: "แพลตฟอร์มวิเคราะห์และแสดงผลข้อมูลครบวงจรสำหรับ Business Intelligence" },
    category: { en: "Database", th: "ฐานข้อมูล" },
    icon: Database,
  },
  {
    id: "5",
    name: { en: "Corporate Portal", th: "พอร์ทัลองค์กร" },
    link: "https://example.com/portal",
    description: { en: "Internal corporate portal for employee management and resource access.", th: "พอร์ทัลภายในองค์กรสำหรับจัดการพนักงานและเข้าถึงทรัพยากร" },
    category: { en: "Website", th: "เว็บไซต์" },
    icon: Layout,
  },
  {
    id: "6",
    name: { en: "API Gateway", th: "เกตเวย์ API" },
    link: "https://example.com/api",
    description: { en: "Centralized API management and gateway for microservices architecture.", th: "ระบบจัดการ API รวมศูนย์สำหรับสถาปัตยกรรม Microservices" },
    category: { en: "Backend", th: "แบ็คเอนด์" },
    icon: Server,
  },
  {
    id: "7",
    name: { en: "Cloud Storage Solution", th: "โซลูชันจัดเก็บคลาวด์" },
    link: "https://example.com/cloud",
    description: { en: "Secure cloud storage and file sharing platform for enterprises.", th: "แพลตฟอร์มจัดเก็บไฟล์บนคลาวด์ที่ปลอดภัยสำหรับองค์กร" },
    category: { en: "Cloud", th: "คลาวด์" },
    icon: Cloud,
  },
  {
    id: "8",
    name: { en: "Security Audit Tool", th: "เครื่องมือตรวจสอบความปลอดภัย" },
    link: "https://example.com/security",
    description: { en: "Automated security vulnerability scanning and reporting tool.", th: "เครื่องมือสแกนช่องโหว่ความปลอดภัยและรายงานอัตโนมัติ" },
    category: { en: "Security", th: "ความปลอดภัย" },
    icon: Shield,
  },
  {
    id: "9",
    name: { en: "ML Model Dashboard", th: "แดชบอร์ดโมเดล ML" },
    link: "https://example.com/ml",
    description: { en: "Machine learning model monitoring and deployment dashboard.", th: "แดชบอร์ดสำหรับติดตามและปรับใช้โมเดล Machine Learning" },
    category: { en: "AI/ML", th: "AI/ML" },
    icon: Cpu,
  },
];

// Get unique categories in both languages
const getCategoryKey = (category: { en: string; th: string }) => category.en;

const ITArchive = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Map(allProjects.map((p) => [getCategoryKey(p.category), p.category])).values()
    );
    return uniqueCategories;
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      return selectedCategory === "All" || project.category.en === selectedCategory;
    });
  }, [selectedCategory]);

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
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            {/* Category Tags */}
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
              {categories.map((category) => (
                <Badge
                  key={category.en}
                  variant={selectedCategory === category.en ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 text-sm rounded-full transition-all ${
                    selectedCategory === category.en
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-card/80 hover:bg-muted border-border"
                  }`}
                  onClick={() => setSelectedCategory(category.en)}
                >
                  {t(category)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={t(project.name)}
                link={project.link}
                description={t(project.description)}
                icon={project.icon}
                category={t(project.category)}
                showCategory
                compact
              />
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t(contentData.archive.noResults)}</p>
            </div>
          )}
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default ITArchive;
