import { useParams, Link } from "react-router-dom";
import { Globe, ArrowLeft, Users, CheckCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
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

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
            {t(labels.projectNotFound)}
          </h1>
          <Link to="/it">
            <Button className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground">
              {t(labels.backToIT)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8 p-0 hover:bg-transparent"
            asChild
          >
            <Link to="/software">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">{t(labels.backToProjects)}</span>
            </Link>
          </Button>

          {/* Project Header */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))]">
              {t(project.name)}
            </h1>
          </div>

          {/* Visit Website CTA */}
          <div className="mb-12 text-left">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-lg shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] font-medium tracking-wide w-full sm:w-auto"
              >
                <Globe className="w-5 h-5 mr-3" />
                {t(labels.visitWebsite)}
              </Button>
            </a>
          </div>

          {/* Project Details Card */}
          <div className="bg-white border border-border rounded-3xl p-8 sm:p-10 shadow-lg mb-10">
            {/* Full Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
                {t(labels.aboutProject)}
              </h2>
              <p className="text-[hsl(var(--ds-chocolate))]/80 leading-relaxed text-lg">
                {t(project.fullDesc)}
              </p>
            </div>

            {/* Target Audience */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(labels.forWhom)}
                </h2>
              </div>
              <ul className="space-y-3">
                {t(project.target).map((audience, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[hsl(var(--ds-chocolate))]/80"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {audience}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(labels.keyFeatures)}
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t(project.features).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[hsl(var(--ds-chocolate))]/80"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default ITProjectDetail;
