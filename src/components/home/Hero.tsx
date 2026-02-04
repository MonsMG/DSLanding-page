import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Abstract Artistic Background - Modern Infrastructure */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ds-beige))] via-[hsl(var(--ds-cream))] to-white" />

      {/* Abstract Artistic Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Large flowing gradient blobs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-primary/15 to-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-[hsl(var(--ds-beige))] to-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-[hsl(var(--ds-cream))] rounded-full blur-3xl" />

        {/* Subtle geometric accents */}
        <div className="absolute bottom-40 left-16 w-24 h-24 border border-primary/20 rounded-lg rotate-12" />
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-primary/30 rounded-full" />
        
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        {/* Main Headline - Digital Solution */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 text-[hsl(var(--ds-chocolate))]">
          Digital Solution
        </h1>

        {/* Slogan */}
        <p className="text-xl sm:text-2xl md:text-3xl text-[hsl(var(--ds-chocolate))]/80 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
          "From Vision to Digital Solution"
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/it">
            <Button size="lg" className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-12 py-8 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl min-w-[220px]">
              Explore IT
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
          <Link to="/production">
            <Button size="lg" className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-12 py-8 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl min-w-[220px]">
              Explore Production
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(var(--ds-beige))] to-transparent" />
    </section>;
};
export default Hero;