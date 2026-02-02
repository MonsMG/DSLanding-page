import { motion } from "framer-motion";
import { BadgeCheck, CalendarCheck, Mail, Code, Smartphone, ExternalLink } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Check-in System",
    link: "https://check-it-ouch.lovable.app/",
    description: "A streamlined check-in system for tracking attendance and achievements with real-time updates.",
    icon: BadgeCheck,
    accentColor: "text-primary",
  },
  {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    icon: CalendarCheck,
    accentColor: "text-primary",
  },
  {
    id: "3",
    name: "Messaging Hub",
    link: "https://uni-send-broadcast.lovable.app/",
    description: "Unified communication platform for seamless team messaging and broadcast announcements.",
    icon: Mail,
    accentColor: "text-primary",
  },
  {
    id: "4",
    name: "Code Playground",
    link: "https://example.com/code-playground",
    description: "Interactive development environment for testing and sharing code snippets with your team.",
    icon: Code,
    accentColor: "text-primary",
  },
  {
    id: "5",
    name: "Mobile Dashboard",
    link: "https://example.com/mobile-dashboard",
    description: "Responsive mobile-first dashboard for monitoring key metrics and analytics on the go.",
    icon: Smartphone,
    accentColor: "text-primary",
  },
];

const IT = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements - Matching Production Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Cover Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Digital Solutions
              </span>
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              IT Projects
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of innovative digital solutions designed to streamline workflows and enhance productivity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group capsule-card overflow-hidden"
                >
                  {/* Project Icon Cover */}
                  <div className="aspect-square bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <IconComponent 
                      className={`w-16 h-16 ${project.accentColor} group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={1.5}
                    />
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
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
