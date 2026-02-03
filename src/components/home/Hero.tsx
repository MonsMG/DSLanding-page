import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Abstract Artistic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50" />

      {/* Abstract Artistic Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Large flowing gradient blobs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-[#F16001]/20 to-orange-200/30 rounded-full blur-3xl" />
        <div
          className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-amber-200/40 to-orange-100/30 rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#F16001]/15 to-yellow-100/20 rounded-full blur-3xl"
        />
        
        {/* Subtle geometric accents */}
        <div className="absolute top-32 right-1/4 w-40 h-40 border-2 border-[#F16001]/10 rounded-full" />
        <div className="absolute bottom-40 left-16 w-24 h-24 border border-orange-200/40 rounded-lg rotate-12" />
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-[#F16001]/30 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-orange-300/40 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        {/* Main Headline - Digital Solution */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight mb-8 text-[#333333]"
        >
          Digital Solution
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xl sm:text-2xl md:text-3xl text-[#333333]/80 max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
        >
          "From Vision to Digital Solution"
        </motion.p>

        {/* CTA Buttons with #F16001 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/it">
            <Button
              size="lg"
              className="bg-[#F16001] hover:bg-[#d95601] text-white px-12 py-8 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[220px]"
            >
              Explore IT
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/production">
            <Button
              size="lg"
              className="bg-[#F16001] hover:bg-[#d95601] text-white px-12 py-8 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[220px]"
            >
              Explore Production
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;
