import { motion } from "framer-motion";
import { BadgeCheck, CalendarCheck, Mail, ExternalLink } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import FloatingElements from "@/components/home/FloatingElements";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  bgGradient: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Check-in",
    link: "https://check-it-ouch.lovable.app/",
    description: "A streamlined check-in system for tracking attendance and achievements.",
    icon: BadgeCheck,
    accentColor: "text-yellow-500",
    bgGradient: "from-yellow-50 to-amber-100",
  },
  {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description: "Intelligent scheduling tool for matching availability and coordinating time.",
    icon: CalendarCheck,
    accentColor: "text-green-500",
    bgGradient: "from-green-50 to-emerald-100",
  },
  {
    id: "3",
    name: "Messaging Hub",
    link: "https://uni-send-broadcast.lovable.app/",
    description: "Unified communication platform for seamless team messaging and broadcasts.",
    icon: Mail,
    accentColor: "text-amber-700",
    bgGradient: "from-orange-50 to-amber-100",
  },
];

const IT = () => {
  return (
    <div className="min-h-screen bg-background hero-gradient relative overflow-hidden">
      <FloatingElements />
      <Navigation />

      {/* Projects Grid - Immediately visible */}
      <section className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <span className="text-sm font-medium text-muted-foreground">
                Digital Solutions
              </span>
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              IT Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our portfolio of innovative digital solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <motion.a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group glass-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Project Icon Cover */}
                  <div className={`aspect-[4/3] bg-gradient-to-br ${project.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors" />
                    <IconComponent 
                      className={`w-24 h-24 ${project.accentColor} group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={1.5}
                    />
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-6 bg-card/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default IT;
