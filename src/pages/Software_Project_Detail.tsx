import { useParams, Link } from "react-router-dom";
import { Globe, ArrowLeft, Users, CheckCircle, Info } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";

const ITProjectDetail = () => {
  const { t } = useLanguage();
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId
    ? contentData.projects[projectId as keyof typeof contentData.projects]
    : null;
  const labels = contentData.projectDetail;

  // ==========================================
  // ❌ 404 Not Found State
  // ==========================================
  if (!project) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
          <div className="text-center py-16 px-8 bg-white/50 rounded-[2rem] border border-border/50 shadow-sm max-w-lg w-full backdrop-blur-sm animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--ds-chocolate))] mb-6">
              {t(labels.projectNotFound)}
            </h1>
            <Link to="/software">
              <Button className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground rounded-full px-8 h-12 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                {t(labels.backToIT)}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ✅ Project Detail State
  // ==========================================
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 🔙 Back Button */}
          <div className="mb-8 animate-fade-in-up">
            <Button
              variant="ghost"
              className="h-10 px-4 hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-300 rounded-full text-muted-foreground border border-transparent hover:border-border/50"
              asChild
            >
              <Link to="/software">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="font-medium">{t(labels.backToProjects)}</span>
              </Link>
            </Button>
          </div>

          {/* 🎯 Project Header & CTA Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up stagger-1">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
                {t(project.name)}
              </h1>
            </div>

            {/* Visit Website CTA */}
            <div className="shrink-0">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-base shadow-[0_8px_20px_rgb(222,49,99,0.2)] hover:shadow-[0_12px_30px_rgb(222,49,99,0.3)] hover:-translate-y-1 transition-all duration-300 rounded-full font-medium tracking-wide w-full sm:w-auto"
                >
                  <Globe className="w-5 h-5 mr-2.5" />
                  {t(labels.visitWebsite)}
                </Button>
              </a>
            </div>
          </div>

          {/* 📝 Project Details Card (ไร้ขอบ + เงาฟุ้งแบบพรีเมียม) */}
          <div className="bg-white border-0 rounded-[2rem] p-8 sm:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-500 mb-10 animate-fade-in-up stagger-2 relative overflow-hidden">
            {/* Background Decoration ลายน้ำเบาๆ มุมขวาบนการ์ด */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            {/* Full Description */}
            <div className="mb-14 relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(labels.aboutProject)}
                </h2>
              </div>
              <p className="text-[hsl(var(--ds-chocolate))]/70 leading-relaxed text-lg sm:text-xl font-light">
                {t(project.fullDesc)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              {/* Target Audience */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))]">
                    {t(labels.forWhom)}
                  </h2>
                </div>
                <ul className="space-y-4">
                  {t(project.target).map((audience, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[hsl(var(--ds-chocolate))]/80 leading-relaxed"
                    >
                      {/* จุด Bullet */}
                      <div className="min-w-[8px] w-2 h-2 rounded-full bg-primary/80 mt-2.5 shadow-sm" />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Features */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))]">
                    {t(labels.keyFeatures)}
                  </h2>
                </div>
                <ul className="space-y-4">
                  {t(project.features).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[hsl(var(--ds-chocolate))]/80 leading-relaxed"
                    >
                      {/* จุด Bullet */}
                      <div className="min-w-[8px] w-2 h-2 rounded-full bg-[hsl(var(--ds-red-orange))]/80 mt-2.5 shadow-sm" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ITProjectDetail;