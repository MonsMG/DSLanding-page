import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";

const Hero = () => {
  const { t } = useLanguage();
  const { home } = contentData;

  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Main Content — staggered entrance */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        {/* Main Headline */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 text-[hsl(var(--ds-chocolate))] animate-fade-in-up">
          Digital Solution
        </h1>

        {/* Slogan */}
        <p className="text-xl sm:text-2xl md:text-3xl text-[hsl(var(--ds-chocolate))]/80 max-w-3xl mx-auto mb-14 leading-relaxed font-medium animate-fade-in-up stagger-2">
          "
          {t(home.hero.slogan) && t(home.hero.slogan).length >= 2 ? (
            <>
              {/* ท่อนที่ 1: ตัวอักษรตัวแรก (Index 0) */}
              {t(home.hero.slogan).charAt(0)}
              {t(home.hero.slogan).slice(1, 15)}
              
              <span className="mr-5 font-bold">
                {t(home.hero.slogan).slice(15)}
              </span>
            </>
          ) : (
            t(home.hero.slogan)
          )}
          "
        </p>

        {/* CTA Buttons — staggered with visual distinction */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center px-4 sm:px-0">
          {/* ใส่ w-full sm:w-auto ที่ Link เพื่อให้บนมือถือปุ่มขยายได้เต็มที่ */}
          <Link to="/software" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-[250px] h-14 text-base font-semibold tracking-wide rounded-2xl shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              {t(home.hero.exploreSoftware)}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link to="/production" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-[250px] h-14 text-base font-semibold tracking-wide rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              {t(home.hero.exploreProduction)}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Hero;
