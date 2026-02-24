import { Mail, Facebook, Clock } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";

const Contact = () => {
  const { t } = useLanguage();
  const contactMethods = contentData.contact.methods;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl float-delayed" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header — entrance */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[hsl(var(--ds-chocolate))] mb-6">
              {t(contentData.contact.title)}
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-xl mx-auto">
              {t(contentData.contact.subtitle)}
            </p>
          </div>

          {/* Contact Cards — staggered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            {contactMethods.map((method, idx) => {
              const isExternal = method.href.startsWith("http");
              const IconComponent = method.title === "Email" ? Mail : Facebook;

              return (
                <a
                  key={method.title}
                  href={method.href}
                  onClick={(e) => {
                    if (isExternal) {
                      e.preventDefault();
                      window.open(method.href, "_blank", "noopener,noreferrer");
                    }
                  }}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`bg-card border border-border rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-2 w-full sm:w-auto sm:min-w-[240px] cursor-pointer block transition-all duration-300 relative overflow-hidden animate-fade-in-up stagger-${idx + 1}`}
                >
                  {/* Decorative blob */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--ds-chocolate))] mb-2">
                      {method.title}
                    </h3>
                    <p className="text-primary font-medium mb-2 group-hover:underline">
                      {method.value}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {t(method.desc)}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Section Divider */}
          <div className="section-divider mb-12" />

          {/* Office Hours Card — entrance */}
          <div className="flex justify-center animate-fade-in-up stagger-4">
            <div className="bg-card border border-border rounded-3xl p-10 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full max-w-md relative overflow-hidden group">
              {/* Decorative gradient blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] mb-2">
                  {t(contentData.contact.officeHours)}
                </h3>

                {/* Decorative separator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="w-8 h-[2px] bg-primary/30 rounded-full" />
                  <span className="w-2 h-2 bg-primary/40 rounded-full" />
                  <span className="w-8 h-[2px] bg-primary/30 rounded-full" />
                </div>

                {/* Hours info */}
                <div className="bg-gradient-to-br from-primary/5 to-[hsl(var(--ds-cream))] rounded-2xl p-6 border border-primary/10">
                  <p className="font-semibold text-[hsl(var(--ds-chocolate))] mb-2">
                    {t(contentData.contact.weekdays)}
                  </p>
                  <p className="text-xl font-medium text-foreground/80 tracking-wide">
                    08:30 – 16:30
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingChatButton />
    </div>
  );
};

export default Contact;
