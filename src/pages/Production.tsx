import { Play, Camera, Film, Scissors, Image, Video } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import type { LucideIcon } from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  video: Video,
  photography: Camera,
  editing: Scissors,
};

const productionGear = [
  { id: 1, name: "Sony FX6", category: "Cinema Camera" },
  { id: 2, name: "Canon R5", category: "Mirrorless" },
  { id: 3, name: "DJI Ronin 4D", category: "Gimbal System" },
  { id: 4, name: "Aputure 600D", category: "LED Lighting" },
  { id: 5, name: "Zoom F8n Pro", category: "Audio Recorder" },
  { id: 6, name: "DJI Mavic 3", category: "Drone" },
];

const Production = () => {
  const { t } = useLanguage();
  const { production } = contentData;

  const services = [
    { key: "video", ...production.services.video },
    { key: "photography", ...production.services.photography },
    { key: "editing", ...production.services.editing },
  ];

  const workItems = [
    { id: 1, type: "event", ...production.workItems.event1, span: "col-span-1 row-span-1" },
    { id: 2, type: "video", ...production.workItems.video1, span: "col-span-1 row-span-2" },
    { id: 3, type: "image", ...production.workItems.image1, span: "col-span-1 row-span-1" },
    { id: 4, type: "event", ...production.workItems.event2, span: "col-span-2 row-span-1" },
    { id: 5, type: "video", ...production.workItems.video2, span: "col-span-1 row-span-1" },
    { id: 6, type: "image", ...production.workItems.image2, span: "col-span-1 row-span-1" },
  ];

  const behindScenes = [
    { id: 1, ...production.behindScenes.onSet },
    { id: 2, ...production.behindScenes.teamMeeting },
    { id: 3, ...production.behindScenes.equipmentSetup },
    { id: 4, ...production.behindScenes.postProduction },
    { id: 5, ...production.behindScenes.locationScout },
    { id: 6, ...production.behindScenes.clientReview },
  ];

  return (
    <div className="min-h-screen bg-card relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-cream))] to-white" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[hsl(var(--ds-beige))]/60 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Cover Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-left sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
            {production.heroTitle}
          </h1>
          <p className="text-left sm:text-2xl text-[hsl(var(--ds-chocolate))]/80 font-medium mb-4">
            {t(production.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* OUR WORK Section - Masonry Grid */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(production.sections.workSubtitle)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
              {t(production.sections.work)}
            </h2>
          </div>

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
            {workItems.map((item) => (
              <div
                key={item.id}
                className={`group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg ${item.span}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-cream))] to-white" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ds-chocolate))]/10 to-transparent opacity-0 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {item.type === "video" ? (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 mb-3">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  ) : item.type === "event" ? (
                    <Film className="w-12 h-12 text-primary/60 group-hover:text-primary mb-3" />
                  ) : (
                    <Image className="w-12 h-12 text-primary/60 group-hover:text-primary mb-3" />
                  )}
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {t(item.category)}
                  </span>
                  <span className="text-base font-semibold text-[hsl(var(--ds-chocolate))] mt-2 text-center">
                    {t(item.placeholder)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WE'RE CREATE / Services Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(production.sections.createSubtitle)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
              {t(production.sections.create)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.key];
              return (
                <div
                  key={service.key}
                  className="bg-card border border-border rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:from-primary/20">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-[hsl(var(--ds-chocolate))] mb-3">
                    {t(service.label)}
                  </h3>
                  <p className="text-foreground/70">{t(service.description)}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl"
            >
              {t(production.moreDetails)}
            </Button>
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENE Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(production.sections.behindSubtitle)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
              {t(production.sections.behind)}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {behindScenes.map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-6 group cursor-pointer hover:shadow-lg"
              >
                <Camera className="w-10 h-10 text-primary/50 group-hover:text-primary mb-4" />
                <span className="text-base font-semibold text-[hsl(var(--ds-chocolate))] mb-1">
                  {t(item.placeholder)}
                </span>
                <span className="text-sm text-foreground/60">{t(item.description)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Production Gear Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-primary/5 via-white to-[hsl(var(--ds-cream))]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              {t(production.sections.gearSubtitle)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
              {t(production.sections.gear)}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {productionGear.map((gear) => (
              <div
                key={gear.id}
                className="bg-card border border-border rounded-2xl p-6 text-center group hover:shadow-lg"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <Video className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-[hsl(var(--ds-chocolate))] text-sm mb-1">{gear.name}</h4>
                <span className="text-xs text-foreground/60">{gear.category}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl"
            >
              {t(production.viewAllGear)}
            </Button>
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default Production;
