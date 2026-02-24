import { Sparkles, Target, Users, Heart } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import type { LucideIcon } from "lucide-react";

const valueIcons: Record<string, LucideIcon> = {
  innovation: Sparkles,
  quality: Target,
  collaboration: Users,
  passion: Heart,
};

const About = () => {
  const { t } = useLanguage();
  const { about } = contentData;

  const stats = [
    about.stats.projects,
    about.stats.clients,
    about.stats.experience,
    about.stats.team,
  ];

  const values = Object.entries(about.values.items).map(([key, value]) => ({
    key,
    icon: valueIcons[key],
    title: value.title,
    description: value.description,
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Decorative Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-32 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-48 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              {t(about.title)}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t(about.description)}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.value} className="capsule-card p-8 text-center">
                <span className="text-4xl sm:text-5xl font-bold text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t(stat.label)}
                </span>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="capsule-card p-12 sm:p-16 text-center mb-20">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(about.mission.subtitle)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              {t(about.mission.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t(about.mission.description)}
            </p>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(about.values.subtitle)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t(about.values.title)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div key={value.key} className="capsule-card p-8 group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary">
                        {t(value.title)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(value.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brand */}
          <div className="text-center">
            <div className="capsule-card p-16 inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl sm:text-7xl font-bold text-foreground">
                  DS
                </span>
                <span className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                {t(about.brandName)}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default About;
