import { Link } from "react-router-dom";
import { BadgeCheck, CalendarCheck, Mail, ArrowRight, Code, Server, Palette, LineChart, Database } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/it/ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import type { LucideIcon } from "lucide-react";

interface Skill {
  name: { en: string; th: string };
  icon: LucideIcon;
  description: { en: string; th: string };
}

const projectIcons: Record<string, LucideIcon> = {
  "1": BadgeCheck,
  "2": CalendarCheck,
  "3": Mail,
};

const skills: Skill[] = [
  {
    name: { en: "Front-End Development", th: "พัฒนาส่วนหน้า" },
    icon: Code,
    description: { en: "React, TypeScript, Tailwind CSS, responsive design", th: "React, TypeScript, Tailwind CSS, การออกแบบที่ตอบสนอง" }
  },
  {
    name: { en: "Back-End Development", th: "พัฒนาส่วนหลัง" },
    icon: Server,
    description: { en: "Node.js, APIs, database integration, cloud services", th: "Node.js, APIs, การเชื่อมต่อฐานข้อมูล, บริการคลาวด์" }
  },
  {
    name: { en: "UI/UX Design", th: "ออกแบบ UI/UX" },
    icon: Palette,
    description: { en: "User research, wireframing, prototyping, design systems", th: "วิจัยผู้ใช้, วางโครงร่าง, สร้างต้นแบบ, ระบบการออกแบบ" }
  },
  {
    name: { en: "System Analyst", th: "นักวิเคราะห์ระบบ" },
    icon: Database,
    description: { en: "Requirements analysis, system architecture, documentation", th: "วิเคราะห์ความต้องการ, สถาปัตยกรรมระบบ, เอกสาร" }
  },
  {
    name: { en: "Data Science", th: "วิทยาศาสตร์ข้อมูล" },
    icon: LineChart,
    description: { en: "Data analysis, visualization, machine learning basics", th: "วิเคราะห์ข้อมูล, แสดงผลข้อมูล, พื้นฐาน Machine Learning" }
  }
];

const IT = () => {
  const { t } = useLanguage();
  const projects = Object.values(contentData.projects);

  const scrollToProjects = () => {
    const section = document.getElementById("software-projects");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-beige))] to-[hsl(var(--ds-cream))]" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section with Main Slogan */}
      <section className="relative pt-32 pb-16 overflow-hidden my-0 py-[50px]">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 whitespace-pre-line">
              {contentData.home.hero.title}
            </h1>
            <p className="text-left sm:text-xl text-foreground/70 max-w-2xl">
              {t(contentData.home.hero.subtitle)}
            </p>
          <div className="mt-12 software-nav-container flex items-start justify-start py-0 my-[25px]">
              <Button onClick={scrollToProjects}
            size="lg" className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl software-nav-btn">
                {t(contentData.home.hero.button)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Section A: Software Projects */}
      <section id="software-projects" className="relative z-10 py-0 px-[25px]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center">
            {t(contentData.home.projectsTitle)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                id={project.id} 
                name={t(project.name)} 
                link={project.link} 
                description={t(project.desc)} 
                icon={projectIcons[project.id] || BadgeCheck} 
                className="h-full" 
              />
            ))}
          </div>

          {/* View More Archive Button */}
          <div className="flex justify-end mt-12">
            <Link to="/it/archive">
              <Button size="lg" className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl">
                {t(contentData.home.archiveButton)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section B: Technical Skills */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto py-[15px]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center">
            {t(contentData.home.skillsTitle)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {skills.map(skill => {
              const IconComponent = skill.icon;
              return (
                <div key={t(skill.name)} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-[hsl(var(--ds-chocolate))] mb-2">{t(skill.name)}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{t(skill.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>;
};
export default IT;