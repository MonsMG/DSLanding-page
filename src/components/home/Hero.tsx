import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vibrant Colorful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100" />
      
      {/* Abstract Colorful Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-300/30 to-amber-200/30 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-gradient-to-tl from-amber-300/25 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      {/* Abstract geometric accents */}
      <div className="absolute top-20 right-1/4 w-32 h-32 border-4 border-primary/20 rounded-full" />
      <div className="absolute bottom-1/4 left-20 w-20 h-20 border-2 border-accent/30 rounded-lg rotate-45" />
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-primary/40 rounded-full" />
      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-accent/30 rounded-full" />

      {/* Main Content - Open layout without box */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        

        {/* Headline with slow fade-in */}
        <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 2,
        ease: "easeOut"
      }} className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight mb-8 text-foreground">Digital
Solution<br />
          
        </motion.h1>

        {/* Subheadline */}
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.5,
        duration: 1
      }} className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed">
          We transform ideas into stunning, functional digital products 
          that captivate users and drive results.
        </motion.p>

        {/* Distinct CTA Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 2,
        duration: 0.8
      }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/it">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(199,89%,70%)] to-primary hover:from-[hsl(199,89%,65%)] hover:to-primary/90 text-white px-12 py-8 text-xl font-semibold rounded-2xl shadow-glow hover:shadow-medium transition-all duration-300 group min-w-[220px]">
              Explore IT
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/production">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(199,89%,70%)] to-primary hover:from-[hsl(199,89%,65%)] hover:to-primary/90 text-white px-12 py-8 text-xl font-semibold rounded-2xl shadow-medium hover:shadow-glow transition-all duration-300 group min-w-[220px]">
              Explore Production
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>;
};
export default Hero;